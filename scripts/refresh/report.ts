import type { CountryDiff } from "./diff";
import type { FixtureDiscrepancy } from "./fixtures";

const ICON = { added: "🟢 add", removed: "🔴 remove", changed: "🟡 change" } as const;

export type FixtureReport = { structural: string[]; discrepancies: FixtureDiscrepancy[] };

export function renderReport(diffs: CountryDiff[], stampUtc: string, fixtures?: FixtureReport): string {
  const withChanges = diffs.filter((d) => d.changes.length && !d.error);
  const errored = diffs.filter((d) => d.error);
  const clean = diffs.filter((d) => !d.changes.length && !d.error);
  const totalChanges = withChanges.reduce((n, d) => n + d.changes.length, 0);
  const fixtureIssues = (fixtures?.structural.length ?? 0) + (fixtures?.discrepancies.length ?? 0);

  const lines: string[] = [];
  lines.push(`# beautifulgame2026 — refresh report`);
  lines.push(``);
  lines.push(`Run: ${stampUtc}`);
  lines.push(
    `Summary: **${totalChanges} rights change${totalChanges === 1 ? "" : "s"}** across ${withChanges.length}/${diffs.length} countries · ${clean.length} unchanged · ${errored.length} need manual check · **${fixtureIssues} fixture issue${fixtureIssues === 1 ? "" : "s"}**`,
  );
  lines.push(``);

  if (fixtures) {
    lines.push(`## Fixtures`);
    if (!fixtures.structural.length) {
      lines.push(`- ✓ Structure complete (72 group matches, 12 groups, 48 teams).`);
    } else {
      lines.push(`- ✗ Structural problems:`);
      for (const i of fixtures.structural) lines.push(`  - ${i}`);
    }
    if (fixtures.discrepancies.length) {
      lines.push(`- ⚠ Schedule discrepancies vs official (upcoming window):`);
      for (const d of fixtures.discrepancies) {
        lines.push(`  - **${d.match}**: stored ${d.ourKickoffUtc} → official ${d.officialKickoffUtc ?? "?"} — ${d.note}`);
      }
    } else {
      lines.push(`- ✓ No kickoff/venue discrepancies found in the upcoming window.`);
    }
    lines.push(``);
  }
  lines.push(`> Review-gated: nothing is auto-applied. Eyeball the diffs below, then copy verified entries into \`lib/data/rights.ts\` (and \`services.ts\` if a provider name changed). Proposed full data is in \`proposed-rights.json\`.`);
  lines.push(``);

  if (withChanges.length) {
    lines.push(`## Proposed changes`);
    for (const d of withChanges) {
      lines.push(``);
      lines.push(`### ${d.country} — ${d.changes.length} change(s), ${d.unchanged} unchanged`);
      for (const c of d.changes) {
        lines.push(`- ${ICON[c.type]} **${c.provider}** — ${c.detail}`);
      }
    }
    lines.push(``);
  }

  if (errored.length) {
    lines.push(`## Needs manual check`);
    for (const d of errored) lines.push(`- ${d.country}: ${d.error}`);
    lines.push(``);
  }

  if (clean.length) {
    lines.push(`## Unchanged`);
    lines.push(clean.map((d) => d.country).join(", "));
    lines.push(``);
  }

  return lines.join("\n");
}
