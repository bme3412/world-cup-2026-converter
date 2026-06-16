// The contract the researcher must emit, plus a tolerant validator. We never
// trust raw model output — every option is validated and normalized, and the
// `sourceUrl` is required (no source → dropped, never shown as fact).

import type { WatchOption } from "@/lib/types";

export const KINDS = ["free", "paid", "unknown"] as const;
export const DELIVERY = ["tv", "stream"] as const;
export const PERIODS = ["month", "match", "tournament"] as const;

// The instruction block injected into the research prompt.
export const OUTPUT_CONTRACT = `Return ONLY a JSON array (no prose, no markdown fences). Each element:
{
  "provider": "string — broadcaster/service name as viewers know it",
  "kind": "free" | "paid",            // free = free-to-air/no extra cost; paid = subscription/cable
  "price": { "amount": number, "currency": "ISO-4217", "period": "month"|"match"|"tournament" },  // omit when free or price unknown
  "delivery": ["tv"] | ["stream"] | ["tv","stream"],
  "note": "string — short, optional",
  "sourceUrl": "https://… — REQUIRED, the page that supports this claim",
  "confidence": "verified" | "unknown"  // unknown if you could not cross-confirm
}
Rules: include free-to-air broadcaster(s) AND any pay/streaming holder. Only assert a provider you can support with a sourceUrl. Prefer 2026-specific info over 2022. Do not invent prices — omit price if unconfirmed.`;

type RawOption = Record<string, unknown>;

function asDelivery(v: unknown): ("tv" | "stream")[] {
  if (!Array.isArray(v)) return ["tv"];
  const out = v.filter((x): x is "tv" | "stream" => x === "tv" || x === "stream");
  return out.length ? out : ["tv"];
}

function asPrice(v: unknown): WatchOption["price"] | undefined {
  if (!v || typeof v !== "object") return undefined;
  const p = v as Record<string, unknown>;
  if (typeof p.amount !== "number" || typeof p.currency !== "string") return undefined;
  const period = PERIODS.includes(p.period as never) ? (p.period as WatchOption["price"]) : undefined;
  if (!period) return undefined;
  return { amount: p.amount, currency: p.currency, period: period as "month" };
}

export type ValidationResult = { options: WatchOption[]; dropped: string[] };

// Validate + normalize. Drops any option missing a provider or sourceUrl.
export function validateOptions(raw: unknown, verifiedAt: string): ValidationResult {
  const dropped: string[] = [];
  if (!Array.isArray(raw)) return { options: [], dropped: ["payload was not a JSON array"] };

  const options: WatchOption[] = [];
  for (const item of raw as RawOption[]) {
    const provider = typeof item.provider === "string" ? item.provider.trim() : "";
    const sourceUrl = typeof item.sourceUrl === "string" ? item.sourceUrl.trim() : "";
    if (!provider) {
      dropped.push("(missing provider)");
      continue;
    }
    if (!/^https?:\/\//.test(sourceUrl)) {
      dropped.push(`${provider} (no valid sourceUrl)`);
      continue;
    }
    const kind = item.kind === "free" || item.kind === "paid" ? item.kind : "unknown";
    const confidence = item.confidence === "verified" ? "verified" : "unknown";
    options.push({
      provider,
      kind,
      price: kind === "paid" ? asPrice(item.price) : undefined,
      delivery: asDelivery(item.delivery),
      travelsWithUser: false,
      confidence,
      lastVerifiedUtc: verifiedAt,
      note: typeof item.note === "string" ? item.note.trim() || undefined : undefined,
      sourceUrl,
    });
  }
  return { options, dropped };
}

// Pull a JSON array out of a model response that may wrap it in prose/fences.
export function extractJsonArray(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("[");
  const end = body.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("no JSON array found in response");
  }
  return JSON.parse(body.slice(start, end + 1));
}
