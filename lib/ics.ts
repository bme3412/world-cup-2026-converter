// Build an iCalendar (.ics) file for a set of matches, with a 1-hour reminder
// and the cheapest legal way to watch (in the user's country) in each event.

import type { Country, Match } from "@/lib/types";
import { RIGHTS } from "@/lib/data/rights";
import { getOptions, cheapestLegal, formatPrice } from "@/lib/watch";

function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

// One-line "how to watch" summary for the calendar event description.
export function watchSummary(countryCode: string, matchId: string): string {
  const c = cheapestLegal(getOptions(RIGHTS, countryCode, matchId));
  if (c.kind === "free") return `Free on ${c.option.provider}`;
  if (c.kind === "unknown") return "Check local listings";
  return c.option.price ? `${formatPrice(c.option.price)} on ${c.option.provider}` : `Subscription (${c.option.provider})`;
}

export function buildCalendar(matches: Match[], country: Country): string {
  const dtstamp = stamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//beautifulgame2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:beautifulgame2026 matches",
  ];
  for (const m of matches) {
    const start = new Date(m.kickoffUtc);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const title = `${m.home.name} vs ${m.away.name} · ${m.stage}`;
    const desc = `Watch in ${country.name}: ${watchSummary(country.code, m.id)}. https://beautifulgame2026.com/match/${m.id}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${m.id}@beautifulgame2026.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      `SUMMARY:${esc(title)}`,
      `LOCATION:${esc(m.venueCity)}`,
      `DESCRIPTION:${esc(desc)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "TRIGGER:-PT60M",
      `DESCRIPTION:${esc(title)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
