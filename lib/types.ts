// ─────────────────────────────────────────────────────────────────────────────
// beautifulgame2026 — core domain types.
//
// The rights data is the real product and the real difficulty. Everything here
// is shaped so the seed JSON can later be swapped for an API / LLM pipeline
// WITHOUT the UI changing. Keep this file UI-free.
// ─────────────────────────────────────────────────────────────────────────────

export type Team = {
  code: string; // "FRA"
  name: string; // "France"
  flag: string; // "🇫🇷" — purely decorative
};

export type Match = {
  id: string;
  home: Team;
  away: Team;
  stage: string; // "Group D", "Round of 32"
  venueCity: string;
  venueTz: string; // IANA tz, e.g. "America/New_York"
  kickoffUtc: string; // ISO UTC — the single source of truth. Never store local time.
};

export type Price = {
  amount: number;
  currency: string; // ISO 4217, e.g. "USD". Compare prices only WITHIN a currency.
  period: "month" | "match" | "tournament"; // "tournament" = one-off pass
};

/**
 * How confident we are in a rights claim.
 *  - "verified": checked against a real source on `lastVerifiedUtc`.
 *  - "sample":   plausible placeholder data — must be visibly labelled as such.
 *  - "unknown":  we genuinely don't know — render "check local listings", not a guess.
 */
export type Confidence = "verified" | "sample" | "unknown";

export type WatchOption = {
  provider: string; // "RTP Play", "Peacock"
  kind: "free" | "paid" | "unknown";
  price?: Price; // omit for free / unknown
  delivery: ("tv" | "stream")[];

  /**
   * KILLER FEATURE: does this option keep working when the user is abroad,
   * logged in with their home account? Free-to-air and most home OTT subs are
   * geo-blocked → false. This is what a travelling fan actually needs to know.
   */
  travelsWithUser: boolean;

  confidence: Confidence;
  lastVerifiedUtc?: string; // when this claim was last checked — matters more than the source
  note?: string; // "needs cable login", "Spanish commentary"
  sourceUrl?: string; // provenance — where this claim came from
};

/**
 * Keyed by country THEN match — different matches can land on different channels
 * within the same country, so country-only keying would be wrong.
 */
export type RightsTable = Record<
  string /* countryCode */,
  Record<string /* matchId */, WatchOption[]>
>;

export type Region =
  | "North America"
  | "South America"
  | "Europe"
  | "Africa"
  | "Middle East"
  | "Asia"
  | "Oceania";

export type Country = {
  code: string; // ISO 3166-1 alpha-2, e.g. "US"
  name: string;
  demonym: string; // "American", "British" — used in the "I am …" phrasing
  flag: string;
  tz: string; // representative IANA tz used to render "your local time"
  currency: string; // display currency hint for this market
  isEU: boolean; // EU member → eligible for cross-border portability (Reg. 2017/1128)
  region: Region; // groups the (growing) country dropdowns
};
