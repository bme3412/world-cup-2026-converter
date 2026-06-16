"use client";

export type DayMeta = {
  key: string; // YYYY-MM-DD
  weekday: string; // "Tue"
  day: string; // "16"
  month: string; // "Jun"
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
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((d) => {
        const on = d.key === selected;
        return (
          <button
            key={d.key}
            onClick={() => onSelect(d.key)}
            aria-pressed={on}
            className={`flex w-16 shrink-0 flex-col items-center rounded-xl border px-2 py-2.5 transition-colors sm:w-[4.5rem] ${
              on ? "border-berry bg-berry text-white shadow-sm" : "border-line bg-panel hover:border-berry/40"
            }`}
          >
            <span className={`font-mono text-[10px] uppercase tracking-widest ${on ? "text-white/90" : "text-muted"}`}>
              {d.isToday ? "Today" : d.weekday}
            </span>
            <span className={`font-display text-2xl leading-none ${on ? "text-white" : "text-ink"}`}>{d.day}</span>
            <span className={`font-mono text-[10px] uppercase ${on ? "text-white/80" : "text-muted"}`}>{d.month}</span>
          </button>
        );
      })}
    </div>
  );
}
