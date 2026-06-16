"use client";

import { useEffect, useMemo, useState } from "react";
import TeamStrip from "@/components/TeamStrip";
import SentenceControls from "@/components/SentenceControls";
import DayStrip, { type DayMeta } from "@/components/DayStrip";
import MatchCard from "@/components/MatchCard";
import { MATCHES } from "@/lib/data/matches";
import { TEAMS } from "@/lib/data/teams";
import { COUNTRY_BY_CODE } from "@/lib/data/countries";
import { SERVICE_BY_ID, defaultServiceFor } from "@/lib/data/services";
import { RIGHTS } from "@/lib/data/rights";
import { getOptions } from "@/lib/watch";
import { dayKey, formatDateLong } from "@/lib/time";

const ALL_TEAMS = TEAMS.map((t) => t.code);
const DEFAULT_COUNTRY = "US";
const DEFAULT_SERVICE = "ytv";

export default function Page() {
  const [teams, setTeams] = useState<Set<string>>(new Set(ALL_TEAMS));
  const [from, setFrom] = useState(DEFAULT_COUNTRY); // "I'm from"
  const [service, setService] = useState(DEFAULT_SERVICE); // "I have"
  const [current, setCurrent] = useState(DEFAULT_COUNTRY); // "watching from"
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("teams");
    const loc = p.get("loc");
    const f = p.get("from");
    const svc = p.get("svc");
    if (t) setTeams(new Set(t.split(",").filter(Boolean)));
    const cur = loc && COUNTRY_BY_CODE[loc] ? loc : DEFAULT_COUNTRY;
    setCurrent(cur);
    const fromCode = f && COUNTRY_BY_CODE[f] ? f : cur; // default: from = where you are
    setFrom(fromCode);
    const s = svc ? SERVICE_BY_ID[svc] : undefined;
    setService(s && (s.homeCountry === fromCode || s.id === "none") ? svc! : defaultServiceFor(fromCode));
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (!now) return;
    const p = new URLSearchParams();
    if (teams.size && teams.size < ALL_TEAMS.length) p.set("teams", Array.from(teams).join(","));
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

  const filtered = useMemo(
    () => MATCHES.filter((m) => teams.has(m.home.code) || teams.has(m.away.code)),
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
    const firstUpcoming =
      (todayKey && days.find((d) => d.key >= todayKey)) || days[days.length - 1];
    setSelectedDay(firstUpcoming.key);
  }, [days, todayKey, selectedDay, now]);

  const dayMetas: DayMeta[] = days.map((d) => {
    const iso = d.matches[0].kickoffUtc;
    return {
      key: d.key,
      weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: tz }).format(new Date(iso)),
      date: new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: tz }).format(new Date(iso)),
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
  };

  const toggleTeam = (code: string) =>
    setTeams((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pb-16">
      {/* Control deck */}
      <div className="-mx-4 border-b border-berry/15 bg-wash/85 px-4 pb-3 pt-4 backdrop-blur">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl tracking-wide sm:text-2xl">
              BEAUTIFULGAME<span className="text-berry">2026</span>
            </h1>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
              Summer 2026 · how to watch
            </p>
          </div>
          <button
            onClick={share}
            className="shrink-0 rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-muted hover:border-berry/40 hover:text-ink"
          >
            {copied ? "copied ✓" : "share"}
          </button>
        </div>

        <SentenceControls
          from={from}
          service={service}
          current={current}
          onFrom={handleFrom}
          onService={setService}
          onCurrent={setCurrent}
        />
        <div className="mt-3">
          <TeamStrip
            selected={teams}
            onToggle={toggleTeam}
            onAll={() => setTeams(new Set(ALL_TEAMS))}
            onNone={() => setTeams(new Set())}
          />
        </div>
      </div>

      {/* Day picker + the selected day's games */}
      <section className="pt-4">
        {!now ? (
          <p className="py-16 text-center font-mono text-sm text-muted">loading…</p>
        ) : teams.size === 0 ? (
          <p className="py-16 text-center font-mono text-sm text-muted">
            Select a team above to see match days.
          </p>
        ) : !activeDay ? (
          <p className="py-16 text-center font-mono text-sm text-muted">No matches for your teams.</p>
        ) : (
          <>
            <DayStrip days={dayMetas} selected={selectedDay} onSelect={setSelectedDay} />

            <div className="mb-3 mt-4 flex items-baseline justify-between gap-2 px-1">
              <h2 className="font-display text-xl tracking-wide sm:text-2xl">
                {formatDateLong(activeDay.matches[0].kickoffUtc, tz)}
              </h2>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-muted">
                times in {country.name}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {activeDay.matches.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  country={country}
                  fromCountry={fromCountry}
                  service={svc}
                  options={getOptions(RIGHTS, current, m.id)}
                  homeOptions={getOptions(RIGHTS, from, m.id)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="mt-10 border-t border-line pt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        <span className="text-free">✓ Rights verified 15 Jun 2026</span> · every claim sourced ·
        legal paths only · no VPNs · prices change — check the source
      </footer>
    </main>
  );
}
