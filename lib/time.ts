// All formatting derives from a UTC ISO string + an IANA timezone via Intl.
// We never store or pass around local times — only (utcIso, tz) pairs.

export function formatTime(utcIso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(new Date(utcIso));
}

export function formatDay(utcIso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: tz,
  }).format(new Date(utcIso));
}

export function tzAbbr(utcIso: string, tz: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZoneName: "short",
    timeZone: tz,
  }).formatToParts(new Date(utcIso));
  return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
}

export function isUpcoming(utcIso: string, now: Date): boolean {
  return new Date(utcIso).getTime() >= now.getTime();
}

// YYYY-MM-DD in the given timezone — used to group matches into calendar days.
// en-CA gives ISO-style ordering that compares correctly as strings.
export function dayKey(utcIso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: tz,
  }).format(new Date(utcIso));
}

export function formatDateLong(utcIso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: tz,
  }).format(new Date(utcIso));
}
