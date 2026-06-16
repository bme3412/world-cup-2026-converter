"use client";

import type { Country, Match, WatchOption } from "@/lib/types";
import type { Service } from "@/lib/data/services";
import { cheapestLegal, formatPrice, serviceVerdict } from "@/lib/watch";
import { formatTime, tzAbbr } from "@/lib/time";
import { teamColor } from "@/lib/data/teamColors";

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
          <span className="text-muted">subscription</span>
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
        <a href={o.sourceUrl} target="_blank" rel="noreferrer" className="text-[11px] text-berry underline">
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
