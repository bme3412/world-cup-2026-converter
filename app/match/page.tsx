import type { Metadata } from "next";
import Link from "next/link";
import { MATCHES } from "@/lib/data/matches";
import { formatTime, formatDay } from "@/lib/time";

export const metadata: Metadata = {
  title: "All Fixtures — where to watch every match",
  description:
    "The complete 2026 group-stage fixture list. Tap any match for kickoff times in your timezone and where to watch — free, streaming and TV channels by country.",
  alternates: { canonical: "/match" },
};

export default function FixturesIndex() {
  const groups = [...new Set(MATCHES.map((m) => m.stage))].sort();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 font-mono text-[11px] uppercase tracking-wide text-muted">
        <Link href="/" className="hover:text-berry">beautifulgame2026</Link> · fixtures
      </nav>
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">All fixtures</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Every group-stage match. Tap one for kickoff times by timezone and where to watch by country.
      </p>

      {groups.map((g) => {
        const ms = MATCHES.filter((m) => m.stage === g).sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc));
        return (
          <section key={g} className="mb-6">
            <h2 className="mb-2 font-display text-lg tracking-wide">{g}</h2>
            <div className="overflow-hidden rounded-xl border border-line bg-panel">
              {ms.map((m, i) => (
                <Link
                  key={m.id}
                  href={`/match/${m.id}`}
                  className={`flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-wash/60 ${i ? "border-t border-line" : ""}`}
                >
                  <span className="font-medium text-ink">
                    {m.home.flag} {m.home.code} <span className="text-muted">v</span> {m.away.code} {m.away.flag}
                  </span>
                  <span className="font-mono text-[11px] uppercase text-muted">
                    {formatDay(m.kickoffUtc, "UTC")} · {formatTime(m.kickoffUtc, "UTC")} UTC
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
