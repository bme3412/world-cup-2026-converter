"use client";

import type { Country, Match, WatchOption } from "@/lib/types";
import type { Service } from "@/lib/data/services";
import { cheapestLegal, formatPrice, serviceVerdict } from "@/lib/watch";
import { formatTime, tzAbbr } from "@/lib/time";

function Tag({ tone, children }: { tone: "free" | "paid" | "muted" | "berry"; children: React.ReactNode }) {
  const map = {
    free: "bg-free/10 text-free",
    paid: "bg-paid/10 text-paid",
    muted: "bg-muted/10 text-muted",
    berry: "bg-berry/10 text-berry",
  } as const;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[tone]}`}>
      {children}
    </span>
  );
}

function Option({ o, cheapest }: { o: WatchOption; cheapest: boolean }) {
  return (
    <li
      className={`flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border px-3 py-2.5 ${
        cheapest ? "border-free/40 bg-free/[0.06]" : "border-line bg-panel"
      }`}
    >
      <span
        className={`inline-block h-2 w-2 shrink-0 rounded-full ${
          o.kind === "free" ? "bg-free" : o.kind === "paid" ? "bg-paid" : "bg-muted"
        }`}
        aria-hidden
      />
      <span className="font-semibold text-ink">{o.provider}</span>
      <span className="font-mono text-sm">
        {o.kind === "free" ? (
          <span className="text-free">FREE</span>
        ) : o.price ? (
          <span className="text-paid">{formatPrice(o.price)}</span>
        ) : (
          <span className="text-muted">login required</span>
        )}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
        {o.delivery.map((x) => (x === "tv" ? "📺 TV" : "▶ Stream")).join(" · ")}
      </span>
      {cheapest ? <Tag tone="free">★ Cheapest</Tag> : null}
      {o.travelsWithUser ? <Tag tone="free">✈ Travels</Tag> : null}
      <Tag tone={o.confidence === "verified" ? "free" : o.confidence === "sample" ? "berry" : "muted"}>
        {o.confidence === "verified" ? "✓ Verified" : o.confidence === "unknown" ? "Unverified" : "Sample"}
      </Tag>
      {o.sourceUrl ? (
        <a
          href={o.sourceUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[11px] text-berry underline"
        >
          source
        </a>
      ) : null}
      {o.note ? <span className="w-full text-sm text-muted">{o.note}</span> : null}
    </li>
  );
}

export default function MatchCard({
  match,
  country,
  fromCountry,
  service,
  options,
  homeOptions,
}: {
  match: Match;
  country: Country;
  fromCountry: Country;
  service: Service | null;
  options: WatchOption[];
  homeOptions: WatchOption[];
}) {
  const cheapest = cheapestLegal(options);
  const cheapestOpt = cheapest.kind === "unknown" ? null : cheapest.option;
  const isAbroad = fromCountry.code !== country.code;
  // EU cross-border portability: paid EU sub, travelling within the EU.
  const euTrip = fromCountry.isEU && country.isEU && !!service?.euPortable;
  const verdict = serviceVerdict(service, isAbroad, homeOptions, euTrip);

  const localTime = formatTime(match.kickoffUtc, country.tz);
  const localAbbr = tzAbbr(match.kickoffUtc, country.tz);
  const venueTime = formatTime(match.kickoffUtc, match.venueTz);

  // The headline answer for a travelling fan.
  let banner: { tone: "ok" | "bad" | "info"; text: string } | null = null;
  if (verdict.state === "works") {
    banner = {
      tone: "ok",
      text: verdict.portable
        ? `✓ Your ${service!.name} works in ${country.name} via EU cross-border portability${verdict.via ? ` — on ${verdict.via}` : ""}`
        : `✓ Your ${service!.name} works in ${country.name}${verdict.via ? ` — on ${verdict.via}` : ""}`,
    };
  } else if (verdict.state === "blocked") {
    banner = {
      tone: "bad",
      text: `✗ Your ${service!.name} is ${fromCountry.name}-only — it won't work in ${country.name}. Best legal option here ↓`,
    };
  } else if (verdict.state === "no-coverage") {
    banner = {
      tone: "info",
      text: `Your ${service!.name} doesn't carry this match — use an option below`,
    };
  }
  const bannerClass =
    banner?.tone === "ok"
      ? "border-free/30 bg-free/10 text-free"
      : banner?.tone === "bad"
        ? "border-paid/30 bg-paid/10 text-paid"
        : "border-berry/25 bg-berry/[0.06] text-ink";

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-panel shadow-sm">
      {/* Header: time + fixture */}
      <div className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5">
        <div className="w-[4.75rem] shrink-0 sm:w-[5.5rem]">
          <div className="font-mono text-2xl font-semibold leading-none text-berry sm:text-[2rem]">
            {localTime}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">{localAbbr}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-display text-lg leading-none tracking-wide sm:gap-2 sm:text-2xl">
            <span className="text-sm sm:text-lg">{match.home.flag}</span>
            <span>{match.home.code}</span>
            <span className="text-muted">v</span>
            <span>{match.away.code}</span>
            <span className="text-sm sm:text-lg">{match.away.flag}</span>
          </div>
          <div className="mt-1.5 truncate font-mono text-[11px] uppercase tracking-wide text-muted">
            {match.stage} · {match.venueCity} · KO {venueTime} local
          </div>
        </div>
      </div>

      {/* The answer */}
      {banner ? (
        <div className={`mx-4 mb-3 rounded-lg border px-3 py-2 text-sm font-semibold sm:mx-5 ${bannerClass}`}>
          {banner.text}
        </div>
      ) : null}

      {/* Always-visible ways to watch */}
      <div className="border-t border-line bg-wash/40 px-4 py-3 sm:px-5">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">
          Ways to watch in {country.name}
        </div>
        {options.length === 0 ? (
          <p className="text-sm text-muted">
            No verified broadcaster on file for this match in {country.name}. Check local listings — we
            won&apos;t guess.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {options.map((o, i) => (
              <Option key={`${o.provider}-${i}`} o={o} cheapest={!!cheapestOpt && o === cheapestOpt} />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
