"use client";

import { COUNTRIES } from "@/lib/data/countries";
import { servicesForCountry } from "@/lib/data/services";

function Pick({
  value,
  onChange,
  children,
  big,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  big?: boolean;
}) {
  return (
    <span className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer rounded-md border border-line bg-panel px-3 py-1.5 pr-7 font-mono uppercase tracking-wide text-ink hover:border-berry/40 ${
          big ? "text-sm sm:text-base" : "text-xs sm:text-sm"
        }`}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 text-berry">▾</span>
    </span>
  );
}

export default function SentenceControls({
  from,
  service,
  current,
  onFrom,
  onService,
  onCurrent,
}: {
  from: string;
  service: string;
  current: string;
  onFrom: (v: string) => void;
  onService: (v: string) => void;
  onCurrent: (v: string) => void;
}) {
  const myServices = servicesForCountry(from);
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px] uppercase tracking-wide text-muted sm:text-xs">
      <span>I am</span>
      <Pick value={from} onChange={onFrom}>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.demonym}
          </option>
        ))}
      </Pick>
      <span>, I have</span>
      <Pick value={service} onChange={onService}>
        {myServices.map((s) => (
          <option key={s.id} value={s.id}>
            {s.id === "none" ? "— no subscription —" : s.name}
          </option>
        ))}
      </Pick>
      <span>, watching in</span>
      <Pick value={current} onChange={onCurrent} big>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </Pick>
    </div>
  );
}
