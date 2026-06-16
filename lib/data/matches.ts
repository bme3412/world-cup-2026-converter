import type { Match } from "@/lib/types";
import { TEAM_BY_CODE as T } from "@/lib/data/teams";

// ─────────────────────────────────────────────────────────────────────────────
// REAL 2026 FIFA World Cup group-stage fixtures involving the 16 featured teams.
// Sourced from the English Wikipedia per-group pages (final draw of 5 Dec 2025).
// Every kickoff is the venue-local time converted to a single UTC ISO string.
// Knockout fixtures are omitted until the bracket is determined by group results.
// Verified 2026-06-15.
// ─────────────────────────────────────────────────────────────────────────────

const m = (
  id: string,
  home: string,
  away: string,
  stage: string,
  venueCity: string,
  venueTz: string,
  kickoffUtc: string,
): Match => ({ id, home: T[home], away: T[away], stage, venueCity, venueTz, kickoffUtc });

export const MATCHES: Match[] = [
  // Group A
  m("m01", "MEX", "RSA", "Group A", "Mexico City", "America/Mexico_City", "2026-06-11T19:00:00Z"),
  m("m02", "MEX", "KOR", "Group A", "Guadalajara", "America/Mexico_City", "2026-06-19T01:00:00Z"),
  m("m03", "CZE", "MEX", "Group A", "Mexico City", "America/Mexico_City", "2026-06-25T01:00:00Z"),

  // Group B
  m("m04", "CAN", "BIH", "Group B", "Toronto", "America/Toronto", "2026-06-12T19:00:00Z"),
  m("m05", "CAN", "QAT", "Group B", "Vancouver", "America/Vancouver", "2026-06-18T22:00:00Z"),
  m("m06", "SUI", "CAN", "Group B", "Vancouver", "America/Vancouver", "2026-06-24T19:00:00Z"),

  // Group C
  m("m07", "BRA", "MAR", "Group C", "East Rutherford", "America/New_York", "2026-06-13T22:00:00Z"),
  m("m08", "SCO", "MAR", "Group C", "Foxborough", "America/New_York", "2026-06-19T22:00:00Z"),
  m("m09", "BRA", "HAI", "Group C", "Philadelphia", "America/New_York", "2026-06-20T00:30:00Z"),
  m("m10", "SCO", "BRA", "Group C", "Miami Gardens", "America/New_York", "2026-06-24T22:00:00Z"),
  m("m11", "MAR", "HAI", "Group C", "Atlanta", "America/New_York", "2026-06-24T22:00:00Z"),

  // Group D
  m("m12", "USA", "PAR", "Group D", "Inglewood", "America/Los_Angeles", "2026-06-13T01:00:00Z"),
  m("m13", "USA", "AUS", "Group D", "Seattle", "America/Los_Angeles", "2026-06-19T19:00:00Z"),
  m("m14", "TUR", "USA", "Group D", "Inglewood", "America/Los_Angeles", "2026-06-26T02:00:00Z"),

  // Group E
  m("m15", "GER", "CUW", "Group E", "Houston", "America/Chicago", "2026-06-14T17:00:00Z"),
  m("m16", "GER", "CIV", "Group E", "Toronto", "America/Toronto", "2026-06-20T20:00:00Z"),
  m("m17", "ECU", "GER", "Group E", "East Rutherford", "America/New_York", "2026-06-25T20:00:00Z"),

  // Group F
  m("m18", "NED", "JPN", "Group F", "Arlington", "America/Chicago", "2026-06-14T20:00:00Z"),
  m("m19", "NED", "SWE", "Group F", "Houston", "America/Chicago", "2026-06-20T17:00:00Z"),
  m("m20", "TUN", "JPN", "Group F", "Monterrey", "America/Monterrey", "2026-06-21T04:00:00Z"),
  m("m21", "JPN", "SWE", "Group F", "Arlington", "America/Chicago", "2026-06-25T23:00:00Z"),
  m("m22", "TUN", "NED", "Group F", "Kansas City", "America/Chicago", "2026-06-25T23:00:00Z"),

  // Group G
  m("m23", "BEL", "EGY", "Group G", "Seattle", "America/Los_Angeles", "2026-06-15T19:00:00Z"),
  m("m24", "BEL", "IRN", "Group G", "Inglewood", "America/Los_Angeles", "2026-06-21T19:00:00Z"),
  m("m25", "NZL", "BEL", "Group G", "Vancouver", "America/Vancouver", "2026-06-27T03:00:00Z"),

  // Group H
  m("m26", "ESP", "CPV", "Group H", "Atlanta", "America/New_York", "2026-06-15T16:00:00Z"),
  m("m27", "KSA", "URU", "Group H", "Miami Gardens", "America/New_York", "2026-06-15T22:00:00Z"),
  m("m28", "ESP", "KSA", "Group H", "Atlanta", "America/New_York", "2026-06-21T16:00:00Z"),
  m("m29", "URU", "CPV", "Group H", "Miami Gardens", "America/New_York", "2026-06-21T22:00:00Z"),
  m("m30", "URU", "ESP", "Group H", "Guadalajara", "America/Mexico_City", "2026-06-27T00:00:00Z"),

  // Group I
  m("m31", "FRA", "SEN", "Group I", "East Rutherford", "America/New_York", "2026-06-16T19:00:00Z"),
  m("m32", "FRA", "IRQ", "Group I", "Philadelphia", "America/New_York", "2026-06-22T21:00:00Z"),
  m("m33", "NOR", "FRA", "Group I", "Foxborough", "America/New_York", "2026-06-26T19:00:00Z"),

  // Group J
  m("m34", "ARG", "ALG", "Group J", "Kansas City", "America/Chicago", "2026-06-17T01:00:00Z"),
  m("m35", "ARG", "AUT", "Group J", "Arlington", "America/Chicago", "2026-06-22T17:00:00Z"),
  m("m36", "JOR", "ARG", "Group J", "Arlington", "America/Chicago", "2026-06-28T02:00:00Z"),

  // Group K
  m("m37", "POR", "COD", "Group K", "Houston", "America/Chicago", "2026-06-17T17:00:00Z"),
  m("m38", "POR", "UZB", "Group K", "Houston", "America/Chicago", "2026-06-23T17:00:00Z"),
  m("m39", "COL", "POR", "Group K", "Miami Gardens", "America/New_York", "2026-06-27T23:30:00Z"),

  // Group L
  m("m40", "ENG", "CRO", "Group L", "Arlington", "America/Chicago", "2026-06-17T20:00:00Z"),
  m("m41", "ENG", "GHA", "Group L", "Foxborough", "America/New_York", "2026-06-23T20:00:00Z"),
  m("m42", "PAN", "CRO", "Group L", "Toronto", "America/Toronto", "2026-06-23T23:00:00Z"),
  m("m43", "PAN", "ENG", "Group L", "East Rutherford", "America/New_York", "2026-06-27T21:00:00Z"),
  m("m44", "CRO", "GHA", "Group L", "Philadelphia", "America/New_York", "2026-06-27T21:00:00Z"),
];

export const MATCH_BY_ID: Record<string, Match> = Object.fromEntries(
  MATCHES.map((mt) => [mt.id, mt]),
);
