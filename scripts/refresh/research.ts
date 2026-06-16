// Re-research one country's 2026 World Cup broadcast rights via the Anthropic
// API with the web-search server tool. Returns validated WatchOption[].

import Anthropic from "@anthropic-ai/sdk";
import type { Country, WatchOption } from "@/lib/types";
import { OUTPUT_CONTRACT, extractJsonArray, validateOptions } from "./schema";

const MODEL = "claude-opus-4-8";

const SYSTEM = `You are a broadcast-rights researcher for the 2026 FIFA World Cup (11 June – 19 July 2026, hosted by USA/Canada/Mexico, 48 teams). Find the CURRENT, 2026-specific rights holders for a given country and emit them as structured JSON. Prioritise authoritative sources: the Wikipedia "2026 FIFA World Cup broadcasting rights" page, FIFA media-rights releases, and each broadcaster's own World Cup page. Cross-check at least two sources where possible. Never invent a broadcaster or a price.`;

export type CountryResearch = {
  country: string;
  options: WatchOption[];
  dropped: string[];
  error?: string;
};

export async function researchCountry(
  client: Anthropic,
  country: Country,
  seedSources: string[],
  verifiedAt: string,
): Promise<CountryResearch> {
  const user = `Research how to legally watch the 2026 FIFA World Cup in ${country.name} (${country.code}). Identify every broadcaster/streaming service that holds 2026 rights — free-to-air AND pay. Anchor sources to check first:\n${seedSources.map((s) => `- ${s}`).join("\n")}\n\n${OUTPUT_CONTRACT}`;

  const messages: Anthropic.MessageParam[] = [{ role: "user", content: user }];

  try {
    let final: Anthropic.Message | undefined;
    // Server tool loop: web_search runs server-side; re-send on pause_turn.
    for (let i = 0; i < 6; i++) {
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 16000,
        thinking: { type: "adaptive" },
        tools: [{ type: "web_search_20260209", name: "web_search" } as never],
        system: SYSTEM,
        messages,
      });
      if (resp.stop_reason === "pause_turn") {
        messages.push({ role: "assistant", content: resp.content });
        continue;
      }
      final = resp;
      break;
    }
    if (!final) return { country: country.code, options: [], dropped: [], error: "did not converge (pause_turn loop)" };

    const text = final.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const parsed = extractJsonArray(text);
    const { options, dropped } = validateOptions(parsed, verifiedAt);
    return { country: country.code, options, dropped };
  } catch (err) {
    return {
      country: country.code,
      options: [],
      dropped: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
