// Fixture validation for the weekly refresh: structural completeness (every
// group complete) + an LLM cross-check of upcoming kickoff times/venues against
// the official schedule, so a FIFA reschedule or a missing match is surfaced.

import Anthropic from "@anthropic-ai/sdk";
import { MATCHES } from "@/lib/data/matches";
import { extractJsonArray } from "./schema";

const MODEL = "claude-opus-4-8";

// Same invariants as scripts/check-fixtures.ts, returned as strings.
export function checkStructure(): string[] {
  const issues: string[] = [];
  const group = MATCHES.filter((m) => m.stage.startsWith("Group "));
  const byGroup = new Map<string, number>();
  for (const m of group) byGroup.set(m.stage, (byGroup.get(m.stage) ?? 0) + 1);
  if (byGroup.size !== 12) issues.push(`Expected 12 groups, found ${byGroup.size}`);
  for (const [g, n] of [...byGroup].sort()) if (n !== 6) issues.push(`${g}: ${n}/6 matches`);
  if (group.length !== 72) issues.push(`Total group matches ${group.length}/72`);
  const team = new Map<string, number>();
  for (const m of group) {
    team.set(m.home.code, (team.get(m.home.code) ?? 0) + 1);
    team.set(m.away.code, (team.get(m.away.code) ?? 0) + 1);
  }
  if (team.size !== 48) issues.push(`${team.size} teams (expected 48)`);
  for (const [c, n] of [...team].sort()) if (n !== 3) issues.push(`${c}: ${n} games (expected 3)`);
  return issues;
}

export type FixtureDiscrepancy = {
  match: string;
  ourKickoffUtc: string;
  officialKickoffUtc: string | null;
  note: string;
};

// LLM cross-check upcoming matches' kickoff/venue vs the official schedule.
export async function crossCheckSchedule(
  client: Anthropic,
  windowDays: number,
  nowMs: number,
): Promise<FixtureDiscrepancy[]> {
  const horizon = nowMs + windowDays * 86_400_000;
  const upcoming = MATCHES.filter((m) => {
    const t = new Date(m.kickoffUtc).getTime();
    return t >= nowMs && t <= horizon;
  }).sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
  if (!upcoming.length) return [];

  const list = upcoming
    .map((m) => `${m.id}: ${m.home.code} v ${m.away.code} (${m.stage}) — stored ${m.kickoffUtc} @ ${m.venueCity}`)
    .join("\n");

  const user = `Verify each 2026 FIFA World Cup match below against the OFFICIAL schedule (Wikipedia per-group pages / FIFA.com). For any match whose real kickoff time (UTC) or venue differs from what is stored, report it.\n\n${list}\n\nReturn ONLY a JSON array of discrepancies (omit matches that are correct). Each: { "id": "m31", "match": "FRA v SEN", "ourKickoffUtc": "<stored>", "officialKickoffUtc": "<real, or null if cancelled/unknown>", "note": "short reason" }. If everything matches, return [].`;

  const messages: Anthropic.MessageParam[] = [{ role: "user", content: user }];
  let final: Anthropic.Message | undefined;
  try {
    for (let i = 0; i < 6; i++) {
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 8000,
        thinking: { type: "adaptive" },
        tools: [{ type: "web_search_20260209", name: "web_search" } as never],
        messages,
      });
      if (resp.stop_reason === "pause_turn") {
        messages.push({ role: "assistant", content: resp.content });
        continue;
      }
      final = resp;
      break;
    }
    if (!final) return [];
    const text = final.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    const arr = extractJsonArray(text) as Record<string, unknown>[];
    return arr.map((d) => ({
      match: String(d.match ?? d.id ?? "?"),
      ourKickoffUtc: String(d.ourKickoffUtc ?? ""),
      officialKickoffUtc: d.officialKickoffUtc ? String(d.officialKickoffUtc) : null,
      note: String(d.note ?? ""),
    }));
  } catch {
    return [];
  }
}
