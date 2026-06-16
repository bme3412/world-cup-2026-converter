// Compare freshly-researched options against the committed country-level data.
// Surfaces only what changed — added/removed providers and price/kind/delivery
// shifts — so a human reviews a short list, not the whole table.

import type { WatchOption } from "@/lib/types";

const key = (p: string) => p.toLowerCase().replace(/\s+/g, " ").trim();
const priceStr = (o: WatchOption) =>
  o.price ? `${o.price.amount} ${o.price.currency}/${o.price.period}` : o.kind === "paid" ? "(unpriced)" : "—";

export type Change =
  | { type: "added"; provider: string; detail: string }
  | { type: "removed"; provider: string; detail: string }
  | { type: "changed"; provider: string; detail: string };

export type CountryDiff = {
  country: string;
  changes: Change[];
  unchanged: number;
  error?: string;
};

export function diffCountry(
  countryCode: string,
  current: WatchOption[],
  fresh: WatchOption[],
  error?: string,
): CountryDiff {
  if (error) return { country: countryCode, changes: [], unchanged: 0, error };

  const curByKey = new Map(current.map((o) => [key(o.provider), o]));
  const freshByKey = new Map(fresh.map((o) => [key(o.provider), o]));
  const changes: Change[] = [];
  let unchanged = 0;

  for (const [k, f] of freshByKey) {
    const c = curByKey.get(k);
    if (!c) {
      changes.push({ type: "added", provider: f.provider, detail: `${f.kind} · ${priceStr(f)} · ${f.delivery.join("/")}` });
      continue;
    }
    const diffs: string[] = [];
    if (c.kind !== f.kind) diffs.push(`kind ${c.kind}→${f.kind}`);
    if (priceStr(c) !== priceStr(f)) diffs.push(`price ${priceStr(c)}→${priceStr(f)}`);
    if (c.delivery.join("/") !== f.delivery.join("/")) diffs.push(`delivery ${c.delivery.join("/")}→${f.delivery.join("/")}`);
    if (diffs.length) changes.push({ type: "changed", provider: f.provider, detail: diffs.join(", ") });
    else unchanged++;
  }
  for (const [k, c] of curByKey) {
    if (!freshByKey.has(k)) {
      changes.push({ type: "removed", provider: c.provider, detail: "no longer found in sources" });
    }
  }

  return { country: countryCode, changes, unchanged };
}
