// Centralized analytics: one place for event names, a consistent context shape,
// and attribution. Every event carries `source` (utm_source or referrer host) so
// custom events are attributable — not only page views.

import { track } from "@vercel/analytics";
import type { Country, Match, WatchOption } from "@/lib/types";
import type { Service } from "@/lib/data/services";

let ENTRY_SOURCE = "";

// Call once on first client load to record where the visit came from.
export function captureEntry(): void {
  if (ENTRY_SOURCE || typeof window === "undefined") return;
  const utm = new URLSearchParams(window.location.search).get("utm_source");
  if (utm) {
    ENTRY_SOURCE = utm;
  } else if (document.referrer) {
    try {
      ENTRY_SOURCE = new URL(document.referrer).hostname.replace(/^www\./, "");
    } catch {
      ENTRY_SOURCE = "direct";
    }
  } else {
    ENTRY_SOURCE = "direct";
  }
}

export type Ctx = { watching_country: string; nationality: string; subscription: string };

export function ctxOf(fromCountry: Country, country: Country, service: Service | null): Ctx {
  return {
    watching_country: country.code,
    nationality: fromCountry.demonym,
    subscription: service && service.id !== "none" ? service.name : "none",
  };
}

// Human-readable, stable match id for analytics, e.g. "FRA-SEN-2026-06-16".
export function matchSlug(m: Match): string {
  return `${m.home.code}-${m.away.code}-${m.kickoffUtc.slice(0, 10)}`;
}

// included | free_ota | free_ads | free_stream | cable_required | paid_stream | unknown
export function optionType(o: WatchOption, included: boolean): string {
  const note = (o.note ?? "").toLowerCase();
  if (included) return "included";
  if (o.kind === "free") {
    if (/over-the-air|antenna/.test(note)) return "free_ota";
    if (/\bads\b/.test(note)) return "free_ads";
    return "free_stream";
  }
  if (o.kind === "paid") return /cable|tv-provider|tv provider|login/.test(note) ? "cable_required" : "paid_stream";
  return "unknown";
}

type Props = Record<string, string | number | boolean>;

export function ev(name: string, props: Props): void {
  track(name, { source: ENTRY_SOURCE || "direct", ...props });
}
