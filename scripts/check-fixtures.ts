// Fixture completeness monitor.
//
//   npm run check:fixtures
//
// Verifies the group stage is COMPLETE and consistent, so "is every game shown?"
// has a deterministic answer. Exits non-zero on any gap — wire it into CI so a
// missing fixture (like the opponent-vs-opponent matches we initially lacked)
// can never ship silently. Update the EXPECTED_* constants when knockouts land.

import { MATCHES } from "@/lib/data/matches";

const EXPECTED_GROUPS = 12;
const MATCHES_PER_GROUP = 6; // 4 teams, round-robin
const GAMES_PER_TEAM = 3;
const EXPECTED_TEAMS = 48;

function validTz(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const issues: string[] = [];
const group = MATCHES.filter((m) => m.stage.startsWith("Group "));

// Per-group counts
const byGroup = new Map<string, number>();
for (const m of group) byGroup.set(m.stage, (byGroup.get(m.stage) ?? 0) + 1);
const groups = [...byGroup.keys()].sort();
if (groups.length !== EXPECTED_GROUPS) {
  issues.push(`Expected ${EXPECTED_GROUPS} groups, found ${groups.length} (${groups.join(", ")})`);
}
for (const g of groups) {
  const n = byGroup.get(g)!;
  if (n !== MATCHES_PER_GROUP) issues.push(`${g}: ${n}/${MATCHES_PER_GROUP} matches`);
}

// Total
if (group.length !== EXPECTED_GROUPS * MATCHES_PER_GROUP) {
  issues.push(`Total group matches ${group.length}, expected ${EXPECTED_GROUPS * MATCHES_PER_GROUP}`);
}

// Per-team games + team count
const teamGames = new Map<string, number>();
for (const m of group) {
  teamGames.set(m.home.code, (teamGames.get(m.home.code) ?? 0) + 1);
  teamGames.set(m.away.code, (teamGames.get(m.away.code) ?? 0) + 1);
}
if (teamGames.size !== EXPECTED_TEAMS) {
  issues.push(`${teamGames.size} teams in the group stage, expected ${EXPECTED_TEAMS}`);
}
for (const [code, n] of [...teamGames].sort()) {
  if (n !== GAMES_PER_TEAM) issues.push(`${code}: ${n} group games (expected ${GAMES_PER_TEAM})`);
}

// Duplicate / repeated pairings within a group
const pairs = new Set<string>();
for (const m of group) {
  const key = [m.home.code, m.away.code].sort().join("-") + " @ " + m.stage;
  if (pairs.has(key)) issues.push(`Repeated pairing: ${key}`);
  pairs.add(key);
}

// Field integrity across ALL matches
const ids = new Set<string>();
for (const m of MATCHES) {
  if (ids.has(m.id)) issues.push(`Duplicate match id: ${m.id}`);
  ids.add(m.id);
  if (!m.home || !m.away) issues.push(`${m.id}: unknown team code`);
  if (Number.isNaN(new Date(m.kickoffUtc).getTime())) issues.push(`${m.id}: bad kickoffUtc "${m.kickoffUtc}"`);
  if (!validTz(m.venueTz)) issues.push(`${m.id}: bad venueTz "${m.venueTz}"`);
}

console.log(
  `Group stage: ${group.length}/${EXPECTED_GROUPS * MATCHES_PER_GROUP} matches · ${groups.length} groups · ${teamGames.size} teams`,
);

if (issues.length) {
  console.error(`\n✗ ${issues.length} issue(s):`);
  for (const i of issues) console.error("  - " + i);
  process.exit(1);
}
console.log("✓ Fixtures complete and consistent.");
