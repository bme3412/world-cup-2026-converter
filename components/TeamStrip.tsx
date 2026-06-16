"use client";

import { useState } from "react";
import { TEAMS } from "@/lib/data/teams";

export default function TeamStrip({
  selected,
  onToggle,
  onAll,
  onNone,
}: {
  selected: Set<string>;
  onToggle: (code: string) => void;
  onAll: () => void;
  onNone: () => void;
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const shown = query
    ? TEAMS.filter((t) => t.code.toLowerCase().includes(query) || t.name.toLowerCase().includes(query))
    : TEAMS;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Filter teams · {selected.size}/{TEAMS.length}
        </span>
        <div className="flex gap-3 font-mono text-[11px] uppercase tracking-wide">
          <button onClick={onAll} className="text-berry hover:underline">all</button>
          <button onClick={onNone} className="text-muted hover:text-ink">none</button>
        </div>
      </div>

      <div className="relative mb-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search teams…"
          className="w-full rounded-lg border border-line bg-panel py-1.5 pl-7 pr-7 text-sm text-ink placeholder:text-muted/70 focus:border-berry/40"
        />
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">⌕</span>
        {q ? (
          <button
            onClick={() => setQ("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink"
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>

      {shown.length === 0 ? (
        <p className="py-2 text-center text-xs text-muted">No teams match “{q}”.</p>
      ) : (
        <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto pb-1 sm:max-h-none sm:overflow-visible">
          {shown.map((t) => {
            const on = selected.has(t.code);
            return (
              <button
                key={t.code}
                onClick={() => onToggle(t.code)}
                aria-pressed={on}
                title={t.name}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
                  on
                    ? "border-berry/60 bg-berry/15 text-ink"
                    : "border-line bg-panel text-muted hover:border-berry/30"
                }`}
              >
                <span className="text-sm leading-none">{t.flag}</span>
                {t.code}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
