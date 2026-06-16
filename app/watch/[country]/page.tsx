import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MATCHES } from "@/lib/data/matches";
import { COUNTRY_BY_CODE } from "@/lib/data/countries";
import { RIGHTS, COUNTRY_RIGHTS } from "@/lib/data/rights";
import { getOptions, cheapestLegal, formatPrice } from "@/lib/watch";
import { watchUrl } from "@/lib/data/watchUrls";
import { formatTime, formatDay } from "@/lib/time";

const SITE = "https://beautifulgame2026.com";

export function generateStaticParams() {
  return Object.keys(COUNTRY_RIGHTS).map((code) => ({ country: code.toLowerCase() }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const country = COUNTRY_BY_CODE[params.country.toUpperCase()];
  if (!country) return {};
  const title = `How to Watch in ${country.name} — TV Channels & Streams`;
  const description = `Where to watch every match of the 2026 tournament in ${country.name}: free-to-air, streaming and pay-TV channels, kickoff times in local time, and the cheapest legal way to watch.`;
  return {
    title,
    description,
    alternates: { canonical: `/watch/${params.country.toLowerCase()}` },
    openGraph: { title, description, url: `${SITE}/watch/${params.country.toLowerCase()}`, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function priceLabel(kind: string, price?: { amount: number; currency: string; period: "month" | "match" | "tournament" }) {
  if (kind === "free") return { text: "Free", tone: "text-free" };
  if (price) return { text: formatPrice(price), tone: "text-paid" };
  return { text: "Subscription", tone: "text-paid" };
}

export default function CountryPage({ params }: { params: { country: string } }) {
  const code = params.country.toUpperCase();
  const country = COUNTRY_BY_CODE[code];
  if (!country || !COUNTRY_RIGHTS[code]) notFound();

  const channels = COUNTRY_RIGHTS[code];
  const fixtures = [...MATCHES].sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
  const ch = cheapestLegal(getOptions(RIGHTS, code, fixtures[0].id));
  const cheapestText = ch.kind === "free" ? "free to air" : ch.kind === "unknown" ? "to be confirmed" : "via a subscription";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `How to watch in ${country.name}`,
    description: `Channels and streams to watch the 2026 tournament in ${country.name}.`,
    url: `${SITE}/watch/${params.country.toLowerCase()}`,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-4 font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:text-berry">beautifulgame2026</Link> ·{" "}
        <Link href="/match" className="hover:text-berry">fixtures</Link>
      </nav>

      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        {country.flag} How to watch in {country.name}
      </h1>
      <p className="mt-2 text-muted">
        Every 2026 match in {country.name} — kickoff times below are local ({country.tz.replace(/_/g, " ")}). The
        cheapest legal way is {cheapestText}.
      </p>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-lg tracking-wide">Channels &amp; streams</h2>
        <div className="overflow-hidden rounded-xl border border-line bg-panel">
          {channels.map((o, i) => {
            const p = priceLabel(o.kind, o.price);
            const url = watchUrl(o.provider);
            return (
              <div key={o.provider} className={`flex items-center justify-between gap-3 px-4 py-3 ${i ? "border-t border-line" : ""}`}>
                <div className="min-w-0">
                  <span className="font-semibold text-ink">{o.provider}</span>{" "}
                  <span className={`font-mono text-sm font-semibold ${p.tone}`}>{p.text}</span>
                  {o.note ? <p className="text-xs text-muted">{o.note}</p> : null}
                </div>
                {url ? (
                  <a href={url} target="_blank" rel="noreferrer" className="shrink-0 rounded-md bg-berry px-3 py-1.5 text-xs font-semibold text-white">
                    Open ↗
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm">
          <Link href={`/?loc=${code}`} className="font-semibold text-berry hover:underline">
            Personalize for your subscription &amp; teams →
          </Link>
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 font-display text-lg tracking-wide">Fixtures · {country.name} time</h2>
        <div className="overflow-hidden rounded-xl border border-line bg-panel">
          {fixtures.map((m, i) => (
            <Link
              key={m.id}
              href={`/match/${m.id}`}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-wash/60 ${i ? "border-t border-line" : ""}`}
            >
              <span className="font-medium text-ink">
                {m.home.flag} {m.home.code} <span className="text-muted">v</span> {m.away.code} {m.away.flag}
              </span>
              <span className="font-mono text-[11px] uppercase text-muted">
                {formatDay(m.kickoffUtc, country.tz)} · {formatTime(m.kickoffUtc, country.tz)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-8 border-t border-line pt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        Legal viewing paths only · no VPNs · rights are sourced &amp; dated
      </footer>
    </main>
  );
}
