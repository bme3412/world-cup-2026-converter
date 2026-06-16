"use client";

import { useState } from "react";
import { TEAMS, POPULAR_TEAMS } from "@/lib/data/teams";

// Filter model: an EMPTY selection means "show all". You only ever see chips
// you've chosen (removable) or searched for — never a wall of 48.
export default function TeamFilter({
  selected,
  onToggle,
  onClear,
}: {
  selected: Set<string>;
  onToggle: (code: string) => void;
  onClear: () => void;
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = query
    ? TEAMS.filter((t) => t.code.toLowerCase().includes(query) || t.name.toLowerCase().includes(query)).slice(0, 16)
    : [];
  const chosen = TEAMS.filter((t) => selected.has(t.code));

  const chip = (code: string, flag: string, label: string, active: boolean, removable = false) => (
    <button
      key={code}
      onClick={() => onToggle(code)}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
        active ? "border-berry/60 bg-berry/15 text-ink" : "border-line bg-panel text-muted hover:border-berry/30"
      }`}
    >
      <span className="text-sm leading-none">{flag}</span>
      {label}
      {removable ? <span className="text-muted">✕</span> : null}
    </button>
  );

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          {selected.size ? `Showing ${selected.size} team${selected.size === 1 ? "" : "s"}` : "Filter by team"}
        </span>
        {selected.size > 0 ? (
          <button onClick={onClear} className="font-mono text-[11px] uppercase tracking-wide text-berry hover:underline">
            clear · show all
          </button>
        ) : null}
      </div>

      {/* chosen teams — removable */}
      {chosen.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {chosen.map((t) => chip(t.code, t.flag, t.code, true, true))}
        </div>
      ) : null}

      {/* search */}
      <div className="relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 48 teams…"
          className="w-full rounded-lg border border-line bg-panel py-1.5 pl-7 pr-7 text-sm text-ink placeholder:text-muted/70 focus:border-berry/40"
        />
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">⌕</span>
        {q ? (
          <button onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink" aria-label="Clear search">
            ✕
          </button>
        ) : null}
      </div>

      {/* search results */}
      {query ? (
        results.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">{results.map((t) => chip(t.code, t.flag, t.code, selected.has(t.code)))}</div>
        ) : (
          <p className="mt-2 text-center text-xs text-muted">No teams match “{q}”.</p>
        )
      ) : selected.size === 0 ? (
        /* default: a few popular quick-picks, all matches shown */
        <div className="mt-2">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-muted/80">
            Popular · showing all matches
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TEAMS.map((t) => chip(t.code, t.flag, t.code, false))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
