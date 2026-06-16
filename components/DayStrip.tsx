"use client";

export type DayMeta = {
  key: string; // YYYY-MM-DD
  weekday: string; // "Tue"
  date: string; // "16 Jun"
  count: number;
  isToday: boolean;
};

export default function DayStrip({
  days,
  selected,
  onSelect,
}: {
  days: DayMeta[];
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {days.map((d) => {
        const on = d.key === selected;
        return (
          <button
            key={d.key}
            onClick={() => onSelect(d.key)}
            aria-pressed={on}
            className={`flex shrink-0 flex-col items-center rounded-lg border px-3 py-2 transition-colors ${
              on
                ? "border-berry bg-berry text-white"
                : "border-line bg-panel text-muted hover:border-berry/40"
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest">
              {d.weekday}
              {d.isToday ? " · today" : ""}
            </span>
            <span className={`font-display text-base leading-tight ${on ? "text-white" : "text-ink"}`}>
              {d.date}
            </span>
            <span className={`font-mono text-[10px] ${on ? "text-white/80" : "text-muted"}`}>
              {d.count} {d.count === 1 ? "game" : "games"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
