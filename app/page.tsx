"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ev, ctxOf, captureEntry } from "@/lib/analytics";
import { buildCalendar, downloadIcs } from "@/lib/ics";
import SettingsPanel from "@/components/SettingsPanel";
import GeoPrompt from "@/components/GeoPrompt";
import DayStrip, { type DayMeta } from "@/components/DayStrip";
import MatchCard from "@/components/MatchCard";
import { MATCHES } from "@/lib/data/matches";
import { COUNTRY_BY_CODE } from "@/lib/data/countries";
import { SERVICE_BY_ID, defaultServiceFor } from "@/lib/data/services";
import { RIGHTS, SUPPORTED_COUNTRY_CODES } from "@/lib/data/rights";
import { readCookie, writeCookie, GEO_COOKIE, LOC_COOKIE } from "@/lib/geo";
import { getOptions } from "@/lib/watch";
import { dayKey, formatDateLong } from "@/lib/time";

const DEFAULT_COUNTRY = "US";
const DEFAULT_SERVICE = "ytv";
const LIVE_WINDOW_MS = 120 * 60 * 1000; // ~2h: a match is "live" within this of kickoff

function matchStatus(kickoffUtc: string, nowMs: number): "upcoming" | "live" | "past" {
  const diff = nowMs - new Date(kickoffUtc).getTime();
  if (diff < 0) return "upcoming";
  if (diff < LIVE_WINDOW_MS) return "live";
  return "past";
}

export default function Page() {
  const [teams, setTeams] = useState<Set<string>>(new Set()); // empty = show all
  const [from, setFrom] = useState(DEFAULT_COUNTRY); // "I'm from"
  const [service, setService] = useState(DEFAULT_SERVICE); // "I have"
  const [current, setCurrent] = useState(DEFAULT_COUNTRY); // "watching from"
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false); // mobile filter drawer

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("teams");
    const loc = p.get("loc")?.toUpperCase() || null;
    const f = p.get("from");
    const svc = p.get("svc");
    if (t) setTeams(new Set(t.split(",").filter(Boolean)));
    // Where you're watching from. Precedence: explicit ?loc (deep link / prior
    // choice carried in the URL) > a persisted manual pick > the edge geo hint > US.
    // We never server-redirect `/`; geo only personalizes this default.
    const known = (c?: string | null) => (c && COUNTRY_BY_CODE[c] ? c : null);
    const cur =
      known(loc) ?? known(readCookie(LOC_COOKIE)) ?? known(readCookie(GEO_COOKIE)) ?? DEFAULT_COUNTRY;
    setCurrent(cur);
    // An explicit ?loc is a deliberate choice — persist it so geo won't override it
    // on the next full navigation (keeps existing ?loc=US marketing links sticky).
    if (known(loc)) writeCookie(LOC_COOKIE, cur);
    const fromCode = f && COUNTRY_BY_CODE[f] ? f : cur; // default: from = where you are
    setFrom(fromCode);
    const s = svc ? SERVICE_BY_ID[svc] : undefined;
    setService(s && (s.homeCountry === fromCode || s.id === "none") ? svc! : defaultServiceFor(fromCode));
    captureEntry();
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (!now) return;
    const p = new URLSearchParams();
    if (teams.size) p.set("teams", Array.from(teams).join(","));
    p.set("loc", current);
    if (from && from !== current) p.set("from", from);
    if (service !== defaultServiceFor(from)) p.set("svc", service);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [teams, current, from, service, now]);

  const country = COUNTRY_BY_CODE[current];
  const fromCountry = COUNTRY_BY_CODE[from];
  const svc = SERVICE_BY_ID[service] ?? null;
  const tz = country.tz;
  const baseCtx = ctxOf(fromCountry, country, svc);

  const filtered = useMemo(
    () => (teams.size === 0 ? MATCHES : MATCHES.filter((m) => teams.has(m.home.code) || teams.has(m.away.code))),
    [teams],
  );

  // Group the user's matches into calendar days (in the watching-from timezone).
  const days = useMemo(() => {
    const map = new Map<string, typeof MATCHES>();
    for (const m of filtered) {
      const k = dayKey(m.kickoffUtc, tz);
      const arr = map.get(k) ?? [];
      arr.push(m);
      map.set(k, arr);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, ms]) => ({
        key,
        matches: ms.slice().sort((a, b) => a.kickoffUtc.localeCompare(b.kickoffUtc)),
      }));
  }, [filtered, tz]);

  const todayKey = now ? dayKey(now.toISOString(), tz) : null;

  // Keep a valid selected day; default to the first upcoming one.
  // Wait for `now` so we don't latch onto the last day before today is known.
  useEffect(() => {
    if (!now) return;
    if (!days.length) {
      setSelectedDay(null);
      return;
    }
    if (selectedDay && days.some((d) => d.key === selectedDay)) return;
    // First day that still has a match yet to kick off — so upcoming games lead.
    const nowMs = now.getTime();
    const firstUpcoming =
      days.find((d) => d.matches.some((m) => new Date(m.kickoffUtc).getTime() >= nowMs)) ||
      days[days.length - 1];
    setSelectedDay(firstUpcoming.key);
  }, [days, selectedDay, now]);

  // Rare, but worth knowing: a team filter that yields nothing.
  useEffect(() => {
    if (now && teams.size > 0 && days.length === 0) {
      ev("zero_results_shown", { watching_country: current, team_filter: Array.from(teams).join(",") });
    }
  }, [now, days.length, teams, current]);

  const dayMetas: DayMeta[] = days.map((d) => {
    const date = new Date(d.matches[0].kickoffUtc);
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: tz }).format(date);
    return {
      key: d.key,
      weekday: fmt({ weekday: "short" }),
      day: fmt({ day: "2-digit" }),
      month: fmt({ month: "short" }),
      count: d.matches.length,
      isToday: d.key === todayKey,
    };
  });

  const activeDay = days.find((d) => d.key === selectedDay) ?? null;

  // Changing nationality re-scopes the "I have" list to that country's setups.
  const handleFrom = (code: string) => {
    setFrom(code);
    const s = SERVICE_BY_ID[service];
    if (!s || (s.homeCountry !== code && s.id !== "none")) setService(defaultServiceFor(code));
    ev("nationality_selected", { ...baseCtx, nationality: COUNTRY_BY_CODE[code]?.demonym ?? code });
  };
  const handleService = (id: string) => {
    setService(id);
    ev("subscription_selected", { ...baseCtx, subscription: SERVICE_BY_ID[id]?.name ?? "none" });
  };
  const handleCurrent = (code: string) => {
    setCurrent(code);
    writeCookie(LOC_COOKIE, code); // a manual pick is explicit — it sticks over geo
    ev("country_selected", { ...baseCtx, watching_country: code });
  };

  const exportCalendar = () => {
    if (!filtered.length) return;
    const tag = teams.size === 1 ? Array.from(teams)[0].toLowerCase() : "all";
    downloadIcs(`beautifulgame2026-${tag}.ics`, buildCalendar(filtered, country));
    ev("calendar_exported", { ...baseCtx, count: filtered.length, team_filter: Array.from(teams).join(",") || "all" });
  };

  const toggleTeam = (code: string) =>
    setTeams((prev) => {
      const next = new Set(prev);
      const added = !next.has(code);
      added ? next.add(code) : next.delete(code);
      ev("team_filter_selected", { ...baseCtx, team_filter: code, action: added ? "add" : "remove" });
      return next;
    });

  const share = async () => {
    const url = window.location.href;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "beautifulgame2026", text: "How to watch the matches", url });
        ev("share_clicked", { ...baseCtx, method: "native" });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      ev("share_clicked", { ...baseCtx, method: "clipboard" });
    } catch (e) {
      const reason = e instanceof Error ? e.name : "unknown";
      if (reason !== "AbortError") ev("share_failed", { ...baseCtx, reason });
    }
  };

  const settingsPanel = (
    <SettingsPanel
      from={from}
      service={service}
      current={current}
      onFrom={handleFrom}
      onService={handleService}
      onCurrent={handleCurrent}
      teams={teams}
      onToggle={toggleTeam}
      onClear={() => setTeams(new Set())}
    />
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 lg:px-6">
      {/* brand bar */}
      <header className="flex items-center justify-between gap-3 py-4">
        <div>
          <h1 className="font-display text-xl tracking-wide sm:text-2xl">
            BEAUTIFULGAME<span className="text-berry">2026</span>
          </h1>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
            Watch every match, wherever you are
          </p>
        </div>
        <button
          onClick={share}
          className="shrink-0 rounded-lg border border-line bg-panel px-4 py-2 font-mono text-[11px] uppercase tracking-wide text-muted hover:border-berry/40 hover:text-ink"
        >
          {copied ? "copied ✓" : "↗ share"}
        </button>
      </header>

      {/* soft geo prompt: confirms the detected country and links to its full
          guide — never a redirect, and easy to override. Wait for `now` so it
          reflects the cookie-resolved country (no hydration flash). Gated to
          non-US so US visitors see exactly the prior experience; it still shows
          when current resolves elsewhere via geo, ?loc, or a manual switch. */}
      {now && current !== DEFAULT_COUNTRY ? (
        <GeoPrompt
          country={country}
          supported={SUPPORTED_COUNTRY_CODES.has(current)}
          onChange={() => setPanelOpen(true)}
          onGuide={() => ev("local_guide_clicked", { ...baseCtx, watching_country: current })}
        />
      ) : null}

      {/* mobile: sticky compact filter bar that expands the panel */}
      <div className="sticky top-0 z-20 -mx-4 mb-3 border-y border-line bg-bg/95 px-4 py-2 backdrop-blur lg:hidden">
        <button
          onClick={() => setPanelOpen((o) => !o)}
          aria-expanded={panelOpen}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <span className="truncate font-mono text-[11px] uppercase tracking-wide text-ink">
            {fromCountry.flag} {fromCountry.demonym} · {svc && svc.id !== "none" ? svc.name : "no sub"} · in {country.name}
          </span>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-berry">
            {panelOpen ? "close ▲" : "edit ▾"}
          </span>
        </button>
        {panelOpen ? <div className="mt-3">{settingsPanel}</div> : null}
      </div>

      <div className="lg:flex lg:items-start lg:gap-6">
        {/* desktop settings sidebar */}
        <aside className="hidden lg:block lg:w-72 lg:shrink-0">
          <div className="lg:sticky lg:top-4">{settingsPanel}</div>
        </aside>

        {/* day picker + the selected day's games */}
        <section className="min-w-0 flex-1 pt-5 lg:pt-0">
          {!now ? (
            <p className="py-16 text-center font-mono text-sm text-muted">loading…</p>
          ) : !activeDay ? (
            <p className="py-16 text-center font-mono text-sm text-muted">No matches for your teams.</p>
          ) : (
            <>
              <DayStrip days={dayMetas} selected={selectedDay} onSelect={setSelectedDay} />

              <div className="mb-3 mt-4 flex flex-wrap items-center justify-between gap-2 px-1">
                <h2 className="font-display text-xl tracking-wide sm:text-2xl">
                  {formatDateLong(activeDay.matches[0].kickoffUtc, tz)}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportCalendar}
                    title="Download an .ics with 1-hour reminders"
                    className="rounded-lg border border-line bg-panel px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-berry hover:border-berry/40"
                  >
                    📅 {teams.size === 1 ? `Add ${Array.from(teams)[0]} matches` : "Add to calendar"}
                  </button>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                    times in {country.name}
                  </span>
                </div>
              </div>

              {(() => {
                const nowMs = now.getTime();
                const withStatus = activeDay.matches.map((m) => ({ m, status: matchStatus(m.kickoffUtc, nowMs) }));
                const prominent = withStatus.filter((x) => x.status !== "past");
                const played = withStatus.filter((x) => x.status === "past");
                const Card = ({ m, status }: { m: (typeof withStatus)[number]["m"]; status: "upcoming" | "live" | "past" }) => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    country={country}
                    fromCountry={fromCountry}
                    service={svc}
                    status={status}
                    options={getOptions(RIGHTS, current, m.id)}
                    homeOptions={getOptions(RIGHTS, from, m.id)}
                  />
                );
                return (
                  <>
                    {prominent.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {prominent.map((x) => (
                          <Card key={x.m.id} m={x.m} status={x.status} />
                        ))}
                      </div>
                    ) : (
                      <p className="py-6 text-center font-mono text-sm text-muted">
                        Every match on this day has kicked off.
                      </p>
                    )}

                    {played.length > 0 ? (
                      <div className="mt-6">
                        <div className="mb-3 flex items-center gap-3 px-1">
                          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                            Already played
                          </span>
                          <span className="h-px flex-1 bg-line" />
                        </div>
                        <div className="flex flex-col gap-4">
                          {played.map((x) => (
                            <Card key={x.m.id} m={x.m} status="past" />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </>
                );
              })()}
            </>
          )}
        </section>
      </div>

      <footer className="mt-10 border-t border-line pt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        <Link href="/match" className="text-berry hover:underline">All fixtures</Link> ·{" "}
        <Link href={`/watch/${current.toLowerCase()}`} className="text-berry hover:underline">
          Watch in {country.name}
        </Link>{" "}
        · <span className="text-free">✓ Rights verified 15 Jun 2026</span> · every claim sourced ·
        legal paths only · no VPNs
      </footer>
    </main>
  );
}
