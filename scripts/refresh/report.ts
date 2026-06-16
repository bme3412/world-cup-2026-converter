import type { CountryDiff } from "./diff";

const ICON = { added: "🟢 add", removed: "🔴 remove", changed: "🟡 change" } as const;

export function renderReport(diffs: CountryDiff[], stampUtc: string): string {
  const withChanges = diffs.filter((d) => d.changes.length && !d.error);
  const errored = diffs.filter((d) => d.error);
  const clean = diffs.filter((d) => !d.changes.length && !d.error);
  const totalChanges = withChanges.reduce((n, d) => n + d.changes.length, 0);

  const lines: string[] = [];
  lines.push(`# beautifulgame2026 — rights refresh report`);
  lines.push(``);
  lines.push(`Run: ${stampUtc}`);
  lines.push(
    `Summary: **${totalChanges} proposed change${totalChanges === 1 ? "" : "s"}** across ${withChanges.length}/${diffs.length} countries · ${clean.length} unchanged · ${errored.length} need manual check`,
  );
  lines.push(``);
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
