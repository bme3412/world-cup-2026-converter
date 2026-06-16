import type { Price, RightsTable, WatchOption } from "@/lib/types";
import type { Service } from "@/lib/data/services";

// Returns the raw options for a match×country. Empty array means "we don't know".
export function getOptions(
  rights: RightsTable,
  countryCode: string,
  matchId: string,
): WatchOption[] {
  return rights[countryCode]?.[matchId] ?? [];
}

export type Cheapest =
  | { kind: "free"; option: WatchOption }
  | { kind: "paid"; option: WatchOption }
  | { kind: "unknown" };

// Free if any free option exists; otherwise the lowest priced option.
// Prices are only ever compared WITHIN a single country (so a single currency).
export function cheapestLegal(options: WatchOption[]): Cheapest {
  if (options.length === 0) return { kind: "unknown" };

  const free = options.find((o) => o.kind === "free");
  if (free) return { kind: "free", option: free };

  const priced = options.filter((o) => o.price);
  if (priced.length) {
    const min = priced.reduce((a, b) =>
      (b.price as Price).amount < (a.price as Price).amount ? b : a,
    );
    return { kind: "paid", option: min };
  }

  // Paid, but no standalone price (e.g. cable-login channels).
  return { kind: "paid", option: options[0] };
}

export function formatPrice(price: Price): string {
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: price.amount % 1 === 0 ? 0 : 2,
  }).format(price.amount);
  const suffix = price.period === "month" ? "/mo" : price.period === "match" ? "/match" : " pass";
  return `${money}${suffix}`;
}

// ── Travel note ──────────────────────────────────────────────────────────────
// The user is in `currentCountry`. If they told us their `homeCountry` and it
// differs, we check whether the options they'd use AT HOME for this match keep
// working abroad. Free-to-air + most home OTT subs are geo-blocked → they don't.
export type TravelNote = {
  abroad: boolean;
  travels: WatchOption[]; // home options that DO work where they are
  blocked: WatchOption[]; // home options that are geo-blocked here
};

export function travelNote(
  homeOptions: WatchOption[],
  isAbroad: boolean,
): TravelNote | null {
  if (!isAbroad) return null;
  return {
    abroad: true,
    travels: homeOptions.filter((o) => o.travelsWithUser),
    blocked: homeOptions.filter((o) => !o.travelsWithUser),
  };
}

// ── "Does my subscription work here?" ────────────────────────────────────────
// The headline answer for a travelling fan. `homeOptions` are this match's
// options in the user's HOME country (where their service lives); `isAbroad` is
// whether they're watching from somewhere other than home.
export type ServiceVerdict =
  | { state: "none" } // no service selected
  | { state: "works"; via?: string; portable?: boolean } // works where they're watching
  | { state: "no-coverage" } // service works here but doesn't carry this match
  | { state: "blocked"; home: string }; // service is geo-locked to its home market

export function serviceVerdict(
  service: Service | null,
  isAbroad: boolean,
  homeOptions: WatchOption[],
  euTrip: boolean, // home & watch both in EU AND the service is EU-portable
): ServiceVerdict {
  if (!service || service.id === "none") return { state: "none" };

  // Which home-country channel (if any) carries this match on the service.
  const via = homeOptions.find((o) => service.carries.includes(o.provider))?.provider;

  // Geo-locked abroad — unless it travels, or EU cross-border portability applies.
  if (isAbroad && !service.travelsAbroad && !euTrip) {
    return { state: "blocked", home: service.homeCountry };
  }
  if (!via) return { state: "no-coverage" };
  return { state: "works", via, portable: isAbroad && euTrip };
}
