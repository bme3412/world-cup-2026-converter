import type { Team } from "@/lib/types";

// The 16 most-followed teams (used elsewhere as a sensible default).
const FEATURED: Team[] = [
  { code: "ARG", name: "Argentina", flag: "🇦🇷" },
  { code: "BRA", name: "Brazil", flag: "🇧🇷" },
  { code: "FRA", name: "France", flag: "🇫🇷" },
  { code: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "ESP", name: "Spain", flag: "🇪🇸" },
  { code: "POR", name: "Portugal", flag: "🇵🇹" },
  { code: "GER", name: "Germany", flag: "🇩🇪" },
  { code: "NED", name: "Netherlands", flag: "🇳🇱" },
  { code: "USA", name: "United States", flag: "🇺🇸" },
  { code: "MEX", name: "Mexico", flag: "🇲🇽" },
  { code: "CAN", name: "Canada", flag: "🇨🇦" },
  { code: "JPN", name: "Japan", flag: "🇯🇵" },
  { code: "MAR", name: "Morocco", flag: "🇲🇦" },
  { code: "CRO", name: "Croatia", flag: "🇭🇷" },
  { code: "BEL", name: "Belgium", flag: "🇧🇪" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾" },
];

// The other 32 nations that share groups with the featured teams.
const OPPONENTS: Team[] = [
  { code: "RSA", name: "South Africa", flag: "🇿🇦" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷" },
  { code: "CZE", name: "Czechia", flag: "🇨🇿" },
  { code: "BIH", name: "Bosnia & Herz.", flag: "🇧🇦" },
  { code: "SUI", name: "Switzerland", flag: "🇨🇭" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦" },
  { code: "SCO", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "HAI", name: "Haiti", flag: "🇭🇹" },
  { code: "PAR", name: "Paraguay", flag: "🇵🇾" },
  { code: "AUS", name: "Australia", flag: "🇦🇺" },
  { code: "TUR", name: "Türkiye", flag: "🇹🇷" },
  { code: "CUW", name: "Curaçao", flag: "🇨🇼" },
  { code: "CIV", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨" },
  { code: "SWE", name: "Sweden", flag: "🇸🇪" },
  { code: "TUN", name: "Tunisia", flag: "🇹🇳" },
  { code: "EGY", name: "Egypt", flag: "🇪🇬" },
  { code: "IRN", name: "Iran", flag: "🇮🇷" },
  { code: "NZL", name: "New Zealand", flag: "🇳🇿" },
  { code: "CPV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳" },
  { code: "IRQ", name: "Iraq", flag: "🇮🇶" },
  { code: "NOR", name: "Norway", flag: "🇳🇴" },
  { code: "ALG", name: "Algeria", flag: "🇩🇿" },
  { code: "AUT", name: "Austria", flag: "🇦🇹" },
  { code: "JOR", name: "Jordan", flag: "🇯🇴" },
  { code: "COD", name: "DR Congo", flag: "🇨🇩" },
  { code: "UZB", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "COL", name: "Colombia", flag: "🇨🇴" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭" },
  { code: "PAN", name: "Panama", flag: "🇵🇦" },
];

// All 48 nations, sorted by code — the full filter set.
export const TEAMS: Team[] = [...FEATURED, ...OPPONENTS].sort((a, b) =>
  a.code.localeCompare(b.code),
);

// The most-followed teams, offered as quick-pick chips in the filter.
export const POPULAR_TEAMS: Team[] = FEATURED;

export const TEAM_BY_CODE: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.code, t]),
);
