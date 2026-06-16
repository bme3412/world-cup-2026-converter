"use client";

import { useEffect } from "react";
import type { Country, Match, WatchOption } from "@/lib/types";
import type { Service } from "@/lib/data/services";
import { ev, ctxOf, matchSlug, optionType, type Ctx } from "@/lib/analytics";
import { cheapestLegal, formatPrice, serviceVerdict } from "@/lib/watch";
import { formatTime, tzAbbr } from "@/lib/time";
import { teamColor } from "@/lib/data/teamColors";
import { watchUrl } from "@/lib/data/watchUrls";
import { buildCalendar, downloadIcs } from "@/lib/ics";
import { VERIFIED_AT } from "@/lib/data/rights";

const CHECKED = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(VERIFIED_AT));

// Fire "ready_to_watch_shown" once per match per session (not on every re-render).
const SHOWN = new Set<string>();

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

function Chip({ tone, children }: { tone: "free" | "info" | "warn"; children: React.ReactNode }) {
  const map = {
    free: "bg-free/10 text-free",
    info: "bg-berry/10 text-berry",
    warn: "bg-gold/10 text-gold",
  } as const;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[tone]}`}>
      {children}
    </span>
  );
}

function Option({
  o,
  cheapest,
  ctx,
  matchId,
  serviceCarries,
  serviceName,
}: {
  o: WatchOption;
  cheapest: boolean;
  ctx: Ctx;
  matchId: string;
  serviceCarries: string[];
  serviceName?: string;
}) {
  const url = watchUrl(o.provider);
  const note = (o.note ?? "").toLowerCase();
  const included = serviceCarries.includes(o.provider);

  // Precise eligibility pill — never a bare "FREE" that hides the catch.
  let pill: { text: string; cls: string };
  if (included) {
    pill = { text: "Included", cls: "bg-free/15 text-free ring-1 ring-free/30" };
  } else if (o.kind === "free") {
    const t = /over-the-air|antenna/.test(note) ? "Free OTA" : /\bads\b/.test(note) ? "Free · ads" : "Free";
    pill = { text: t, cls: "bg-free/12 text-free" };
  } else if (o.kind === "paid") {
    pill = { text: o.price ? formatPrice(o.price) : "Subscription", cls: "bg-paid/10 text-paid" };
  } else {
    pill = { text: "—", cls: "bg-muted/10 text-muted" };
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
        cheapest ? "border-free/50 bg-free/[0.05]" : "border-line bg-panel"
      }`}
    >
      <span className={`shrink-0 rounded-md px-2 py-1 text-center font-mono text-xs font-bold ${pill.cls}`}>
        {pill.text}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-ink">{o.provider}</span>
          {included && serviceName ? <Chip tone="free">with {serviceName}</Chip> : null}
          {cheapest ? <span className="text-[10px] font-bold uppercase tracking-wide text-free">★ cheapest</span> : null}
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
            {o.delivery.map((x) => (x === "tv" ? "TV" : "Stream")).join(" · ")}
          </span>
          {/cable|tv-provider|tv provider|login/.test(note) ? <Chip tone="info">Needs TV provider</Chip> : null}
          {/spanish/.test(note) ? <Chip tone="info">Spanish</Chip> : null}
          {/french/.test(note) ? <Chip tone="info">French</Chip> : null}
          {o.travelsWithUser ? <Chip tone="free">✈ Travels</Chip> : null}
          {o.confidence !== "verified" ? <Chip tone="warn">Unverified</Chip> : null}
        </div>
        {o.note ? <p className="mt-0.5 text-xs leading-snug text-muted">{o.note}</p> : null}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            title={`Open ${o.provider}`}
            onClick={() => ev("watch_option_clicked", { ...ctx, match_id: matchId, provider: o.provider, option_type: optionType(o, included) })}
            className="rounded-md bg-berry px-3 py-1.5 text-xs font-semibold text-white hover:bg-berry/90"
          >
            Open ↗
          </a>
        ) : null}
        {o.sourceUrl ? (
          <a
            href={o.sourceUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => ev("source_clicked", { ...ctx, match_id: matchId, provider: o.provider })}
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
  status = "upcoming",
}: {
  match: Match;
  country: Country;
  fromCountry: Country;
  service: Service | null;
  options: WatchOption[];
  homeOptions: WatchOption[];
  status?: "upcoming" | "live" | "past";
}) {
  const cheapest = cheapestLegal(options);
  const cheapestOpt = cheapest.kind === "unknown" ? null : cheapest.option;
  const isAbroad = fromCountry.code !== country.code;
  const euTrip = fromCountry.isEU && country.isEU && !!service?.euPortable;
  const verdict = serviceVerdict(service, isAbroad, homeOptions, euTrip);

  const ctx = ctxOf(fromCountry, country, service);
  const slug = matchSlug(match);
  const cheapestIncluded = !!cheapestOpt && (service?.carries.includes(cheapestOpt.provider) ?? false);

  // The funnel's "saw the answer" step — once per match per session.
  useEffect(() => {
    if (SHOWN.has(slug)) return;
    SHOWN.add(slug);
    ev("ready_to_watch_shown", {
      ...ctx,
      match_id: slug,
      verdict: verdict.state,
      option_type: cheapestOpt ? optionType(cheapestOpt, cheapestIncluded) : "none",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const localTime = formatTime(match.kickoffUtc, country.tz);
  const localAbbr = tzAbbr(match.kickoffUtc, country.tz);
  const venueTime = formatTime(match.kickoffUtc, match.venueTz);

  const cheapestLabel =
    cheapest.kind === "free"
      ? "Free"
      : cheapest.kind === "unknown"
        ? "Check local listings"
        : cheapestOpt?.price
          ? formatPrice(cheapestOpt.price)
          : "Subscription";
  const cheapestProvider = cheapestOpt?.provider ?? "no listed option";

  // The headline answer — names the user's service explicitly.
  type Pill = { tone: "ok" | "warn" | "info"; icon: string; title: string; sub: string };
  let pill: Pill;
  if (verdict.state === "works") {
    pill = {
      tone: "ok",
      icon: "✓",
      title: `Ready to watch with ${service!.name}`,
      sub: verdict.portable
        ? `Works in ${country.name} via EU portability${verdict.via ? ` — on ${verdict.via}` : ""}`
        : verdict.via
          ? `${verdict.via} included in your plan`
          : `${service!.name} works here`,
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
    pill = {
      tone: cheapest.kind === "free" ? "ok" : "info",
      icon: cheapest.kind === "free" ? "✓" : "▶",
      title: cheapest.kind === "free" ? "Free to watch" : cheapest.kind === "unknown" ? "Check local listings" : `Cheapest · ${cheapestLabel}`,
      sub: cheapest.kind === "unknown" ? "no verified broadcaster on file" : `on ${cheapestProvider}`,
    };
  }
  if (status === "past") {
    pill = { tone: "info", icon: "⏱", title: "Full time", sub: `kicked off ${localTime} ${localAbbr}` };
  }
  const pillClass =
    status === "past"
      ? "border-line bg-wash text-muted"
      : pill.tone === "ok"
        ? "border-free/30 bg-free/10 text-free"
        : pill.tone === "warn"
          ? "border-gold/30 bg-gold/10 text-gold"
          : "border-berry/25 bg-berry/[0.07] text-berry";

  const homeColor = teamColor(match.home.code);
  const awayColor = teamColor(match.away.code);

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-line bg-panel shadow-sm ${
        status === "past" ? "opacity-70" : ""
      }`}
    >
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-24 w-24 opacity-90 sm:h-32 sm:w-32" style={{ background: homeColor, clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-90 sm:h-32 sm:w-32" style={{ background: awayColor, clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

      <div className="relative px-3 pt-5 sm:px-6 sm:pt-6">
        <div className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-1 sm:gap-3">
          <div className="flex w-14 flex-col items-center gap-1.5 sm:w-24">
            <Crest flag={match.home.flag} color={homeColor} />
            <span className="text-center text-[10px] font-bold uppercase leading-tight text-ink sm:text-xs">{match.home.name}</span>
          </div>
          <span className="font-display text-sm text-muted sm:text-base">VS</span>
          <div className="flex flex-col items-center text-center">
            {status === "live" ? (
              <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-paid/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-paid">
                <span className="inline-block h-1.5 w-1.5 animate-glowPulse rounded-full bg-paid" />
                Live
              </span>
            ) : null}
            <div className="font-display text-3xl leading-none text-ink sm:text-[2.5rem]">{localTime}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">
              {localAbbr} · KO {venueTime} local
            </div>
          </div>
          <span className="font-display text-sm text-muted sm:text-base">VS</span>
          <div className="flex w-14 flex-col items-center gap-1.5 sm:w-24">
            <Crest flag={match.away.flag} color={awayColor} />
            <span className="text-center text-[10px] font-bold uppercase leading-tight text-ink sm:text-xs">{match.away.name}</span>
          </div>
        </div>

        <div className={`mx-auto mt-4 flex max-w-md items-center justify-center gap-2.5 rounded-xl border px-4 py-2.5 ${pillClass}`}>
          <span className="text-lg leading-none" aria-hidden>{pill.icon}</span>
          <div className="text-left">
            <div className="font-display text-sm uppercase leading-none tracking-wide sm:text-base">{pill.title}</div>
            <div className="mt-1 text-[11px] font-medium opacity-90">{pill.sub}</div>
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-2 text-center font-mono text-[10px] uppercase tracking-wide text-muted">
          {localTime} {localAbbr} | {match.stage} | {match.venueCity} | KO {venueTime} local
        </div>
      </div>

      <div className="relative border-t border-line bg-wash/40 px-3 py-3 sm:px-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Ways to watch in {country.name} · <span className="text-free">rights checked {CHECKED}</span>
          </span>
          <button
            onClick={() => {
              downloadIcs(`${match.id}.ics`, buildCalendar([match], country));
              ev("calendar_exported", { ...ctx, match_id: slug, count: 1 });
            }}
            title="Add this match to your calendar"
            className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-berry hover:underline"
          >
            📅 add
          </button>
        </div>
        {options.length === 0 ? (
          <p className="text-sm text-muted">
            No verified broadcaster on file for this match in {country.name}. Check local listings — we
            won&apos;t guess.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {options.map((o, i) => (
              <Option
                key={`${o.provider}-${i}`}
                o={o}
                cheapest={!!cheapestOpt && o === cheapestOpt}
                ctx={ctx}
                matchId={slug}
                serviceCarries={service?.carries ?? []}
                serviceName={service && service.id !== "none" ? service.name : undefined}
              />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
