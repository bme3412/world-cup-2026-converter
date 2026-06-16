"use client";

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
  const allOn = selected.size === TEAMS.length;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          Filter teams
        </span>
        <div className="flex gap-3 font-mono text-[11px] uppercase tracking-wide">
          <button onClick={onAll} className={allOn ? "text-berry" : "text-muted hover:text-ink"}>
            all
          </button>
          <button onClick={onNone} className="text-muted hover:text-ink">
            none
          </button>
        </div>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
        {TEAMS.map((t) => {
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
    </div>
  );
}
