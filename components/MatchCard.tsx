"use client";

import type { Country, Match, WatchOption } from "@/lib/types";
import type { Service } from "@/lib/data/services";
import { cheapestLegal, formatPrice, serviceVerdict } from "@/lib/watch";
import { formatTime, tzAbbr } from "@/lib/time";
import { teamColor } from "@/lib/data/teamColors";
import { watchUrl } from "@/lib/data/watchUrls";

function Crest({ flag, color }: { flag: string; color: string }) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] bg-white text-2xl shadow-sm sm:h-16 sm:w-16 sm:text-4xl"
      style={{ borderColor: color }}
    >
      <span>{flag}</span>
    </div>
  );
}

function Option({ o, cheapest }: { o: WatchOption; cheapest: boolean }) {
  const url = watchUrl(o.provider);
  const priceLabel = o.kind === "free" ? "FREE" : o.price ? formatPrice(o.price) : "SUB";
  return (
    <li
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
        cheapest ? "border-free/50 bg-free/[0.05]" : "border-line bg-panel"
      }`}
    >
      {/* price pill */}
      <span
        className={`shrink-0 rounded-md px-2 py-1 font-mono text-xs font-bold ${
          o.kind === "free" ? "bg-free/12 text-free" : "bg-paid/10 text-paid"
        }`}
      >
        {priceLabel}
      </span>

      {/* provider + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold text-ink">{o.provider}</span>
          {cheapest ? <span className="text-[10px] font-bold uppercase tracking-wide text-free">★ cheapest</span> : null}
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
            {o.delivery.map((x) => (x === "tv" ? "TV" : "Stream")).join(" · ")}
          </span>
          {o.confidence !== "verified" ? (
            <span className="font-mono text-[10px] uppercase tracking-wide text-gold">unverified</span>
          ) : null}
          {o.travelsWithUser ? (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-free">✈ travels</span>
          ) : null}
        </div>
        {o.note ? <p className="mt-0.5 text-xs leading-snug text-muted">{o.note}</p> : null}
      </div>

      {/* watch + source */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-berry px-3 py-1.5 text-xs font-semibold text-white hover:bg-berry/90"
          >
            Watch ↗
          </a>
        ) : null}
        {o.sourceUrl ? (
          <a
            href={o.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-muted underline hover:text-berry"
          >
            source
          </a>
        ) : null}
      </div>
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
  const euTrip = fromCountry.isEU && country.isEU && !!service?.euPortable;
  const verdict = serviceVerdict(service, isAbroad, homeOptions, euTrip);

  const localTime = formatTime(match.kickoffUtc, country.tz);
  const localAbbr = tzAbbr(match.kickoffUtc, country.tz);
  const venueTime = formatTime(match.kickoffUtc, match.venueTz);

  const cheapestLabel =
    cheapest.kind === "free"
      ? "FREE"
      : cheapest.kind === "unknown"
        ? "Check local listings"
        : cheapestOpt?.price
          ? formatPrice(cheapestOpt.price)
          : "Subscription";
  const cheapestProvider = cheapestOpt?.provider ?? "no listed option";

  // The headline pill — same legal verdict, styled like the reference (no VPN copy).
  type Pill = { tone: "ok" | "warn" | "info"; icon: string; title: string; sub: string };
  let pill: Pill;
  if (verdict.state === "works") {
    pill = {
      tone: "ok",
      icon: "✓",
      title: "Ready to watch",
      sub: verdict.portable
        ? `${service!.name} works here via EU portability`
        : `Watch on ${verdict.via ?? service!.name}`,
    };
  } else if (verdict.state === "blocked") {
    pill = {
      tone: "warn",
      icon: "⚠",
      title: `${service!.name} won't work here`,
      sub: cheapest.kind === "unknown" ? "Check local listings" : `Watch on ${cheapestProvider} instead`,
    };
  } else if (verdict.state === "no-coverage") {
    pill = {
      tone: "info",
      icon: "•",
      title: `Not on your ${service!.name}`,
      sub: cheapest.kind === "unknown" ? "Check local listings" : `Watch on ${cheapestProvider}`,
    };
  } else {
    // no subscription selected → surface the cheapest legal option
    pill = {
      tone: cheapest.kind === "free" ? "ok" : cheapest.kind === "unknown" ? "info" : "info",
      icon: cheapest.kind === "free" ? "✓" : "▶",
      title: cheapest.kind === "free" ? "Free to watch" : cheapest.kind === "unknown" ? "Check local listings" : `Cheapest · ${cheapestLabel}`,
      sub: cheapest.kind === "unknown" ? "no verified broadcaster on file" : `on ${cheapestProvider}`,
    };
  }
  const pillClass =
    pill.tone === "ok"
      ? "border-free/30 bg-free/10 text-free"
      : pill.tone === "warn"
        ? "border-gold/30 bg-gold/10 text-gold"
        : "border-berry/25 bg-berry/[0.07] text-berry";

  const homeColor = teamColor(match.home.code);
  const awayColor = teamColor(match.away.code);

  return (
    <article className="relative overflow-hidden rounded-2xl border border-line bg-panel shadow-sm">
      {/* diagonal team-colour accents behind each crest */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-24 w-24 opacity-90 sm:h-32 sm:w-32" style={{ background: homeColor, clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-90 sm:h-32 sm:w-32" style={{ background: awayColor, clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

      <div className="relative px-3 pt-5 sm:px-6 sm:pt-6">
        {/* crests + center time */}
        <div className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-1 sm:gap-3">
          <div className="flex w-14 flex-col items-center gap-1.5 sm:w-24">
            <Crest flag={match.home.flag} color={homeColor} />
            <span className="text-center text-[10px] font-bold uppercase leading-tight text-ink sm:text-xs">{match.home.name}</span>
          </div>
          <span className="font-display text-sm text-muted sm:text-base">VS</span>
          <div className="flex flex-col items-center text-center">
            <div className="font-display text-3xl leading-none text-ink sm:text-[2.5rem]">{localTime}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">
              {localAbbr} · kicks off {venueTime} local
            </div>
          </div>
          <span className="font-display text-sm text-muted sm:text-base">VS</span>
          <div className="flex w-14 flex-col items-center gap-1.5 sm:w-24">
            <Crest flag={match.away.flag} color={awayColor} />
            <span className="text-center text-[10px] font-bold uppercase leading-tight text-ink sm:text-xs">{match.away.name}</span>
          </div>
        </div>

        {/* status pill */}
        <div className={`mx-auto mt-4 flex max-w-md items-center justify-center gap-2.5 rounded-xl border px-4 py-2.5 ${pillClass}`}>
          <span className="text-lg leading-none" aria-hidden>{pill.icon}</span>
          <div className="text-left">
            <div className="font-display text-sm uppercase leading-none tracking-wide sm:text-base">{pill.title}</div>
            <div className="mt-1 text-[11px] font-medium opacity-90">{pill.sub}</div>
          </div>
        </div>

        {/* pipe meta row */}
        <div className="mt-4 border-t border-line pt-2 text-center font-mono text-[10px] uppercase tracking-wide text-muted">
          {localTime} {localAbbr} | {match.stage} | {match.venueCity} | KO {venueTime} local
        </div>
      </div>

      {/* always-visible ways to watch */}
      <div className="relative border-t border-line bg-wash/40 px-3 py-3 sm:px-6">
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
