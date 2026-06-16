import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MATCHES, MATCH_BY_ID } from "@/lib/data/matches";
import { COUNTRIES } from "@/lib/data/countries";
import { RIGHTS } from "@/lib/data/rights";
import { getOptions, cheapestLegal, formatPrice } from "@/lib/watch";
import { formatTime, formatDay } from "@/lib/time";

const SITE = "https://beautifulgame2026.com";

const KEY_TZ: [string, string][] = [
  ["UTC", "UTC"],
  ["New York", "America/New_York"],
  ["Los Angeles", "America/Los_Angeles"],
  ["Mexico City", "America/Mexico_City"],
  ["London", "Europe/London"],
  ["Central Europe", "Europe/Paris"],
  ["Tokyo", "Asia/Tokyo"],
  ["Sydney", "Australia/Sydney"],
];

export function generateStaticParams() {
  return MATCHES.map((m) => ({ id: m.id }));
}

export const dynamicParams = false;

function dateLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const m = MATCH_BY_ID[params.id];
  if (!m) return {};
  const title = `${m.home.name} vs ${m.away.name} — Where to Watch & TV Channels`;
  const description = `How to watch ${m.home.name} vs ${m.away.name} (${m.stage}, ${dateLabel(m.kickoffUtc)}): kickoff time in your timezone plus free-to-air, streaming and pay-TV options by country.`;
  return {
    title,
    description,
    alternates: { canonical: `/match/${m.id}` },
    openGraph: { title, description, url: `${SITE}/match/${m.id}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function cheapest(countryCode: string, id: string) {
  const c = cheapestLegal(getOptions(RIGHTS, countryCode, id));
  if (c.kind === "free") return { text: "Free", tone: "text-free", sub: c.option.provider };
  if (c.kind === "unknown") return { text: "—", tone: "text-muted", sub: "check local listings" };
  return { text: c.option.price ? formatPrice(c.option.price) : "Subscription", tone: "text-paid", sub: c.option.provider };
}

export default function MatchPage({ params }: { params: { id: string } }) {
  const m = MATCH_BY_ID[params.id];
  if (!m) notFound();

  const start = m.kickoffUtc;
  const end = new Date(new Date(start).getTime() + 2 * 60 * 60 * 1000).toISOString();
  const withRights = COUNTRIES.filter((c) => getOptions(RIGHTS, c.code, m.id).length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${m.home.name} vs ${m.away.name}`,
    sport: "Association football",
    startDate: start,
    endDate: end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: m.venueCity, address: { "@type": "PostalAddress", addressLocality: m.venueCity } },
    competitor: [
      { "@type": "SportsTeam", name: m.home.name },
      { "@type": "SportsTeam", name: m.away.name },
    ],
    description: `Where to watch ${m.home.name} vs ${m.away.name}: kickoff times by timezone and TV/streaming options by country.`,
    url: `${SITE}/match/${m.id}`,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-4 font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:text-berry">beautifulgame2026</Link>
        {" · "}
        <Link href="/match" className="hover:text-berry">fixtures</Link>
      </nav>

      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        {m.home.flag} {m.home.name} <span className="text-muted">vs</span> {m.away.name} {m.away.flag}
      </h1>
      <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">
        {m.stage} · {m.venueCity} · {dateLabel(m.kickoffUtc)}
      </p>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-lg tracking-wide">Kickoff time</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 rounded-xl border border-line bg-panel p-4 sm:grid-cols-3">
          {KEY_TZ.map(([label, tz]) => (
            <div key={tz} className="flex items-baseline justify-between gap-2">
              <span className="text-sm text-muted">{label}</span>
              <span className="font-mono text-sm font-semibold text-ink">
                {formatTime(m.kickoffUtc, tz)} <span className="text-[10px] text-muted">{formatDay(m.kickoffUtc, tz)}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-lg tracking-wide">Where to watch by country</h2>
        <p className="mb-3 text-sm text-muted">
          Cheapest legal way to watch {m.home.name} vs {m.away.name} in each market, with the broadcaster(s) carrying it.
        </p>
        <div className="overflow-hidden rounded-xl border border-line bg-panel">
          {withRights.map((c, i) => {
            const ch = cheapest(c.code, m.id);
            const providers = getOptions(RIGHTS, c.code, m.id).map((o) => o.provider).join(", ");
            return (
              <div key={c.code} className={`flex items-center justify-between gap-3 px-4 py-2.5 ${i ? "border-t border-line" : ""}`}>
                <Link href={`/watch/${c.code.toLowerCase()}`} className="shrink-0 font-medium text-ink hover:text-berry">
                  {c.flag} {c.name}
                </Link>
                <span className="min-w-0 text-right">
                  <span className={`font-mono text-sm font-semibold ${ch.tone}`}>{ch.text}</span>
                  <span className="block truncate text-xs text-muted">{providers}</span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm">
          <Link href={`/?loc=${withRights[0]?.code ?? "US"}`} className="font-semibold text-berry hover:underline">
            Personalize for your country &amp; subscription →
          </Link>
        </p>
      </section>

      <footer className="mt-8 border-t border-line pt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        Legal viewing paths only · no VPNs · times from a single UTC source
      </footer>
    </main>
  );
}
