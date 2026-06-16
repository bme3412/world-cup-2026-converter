"use client";

import { COUNTRIES } from "@/lib/data/countries";
import { servicesForCountry } from "@/lib/data/services";
import TeamStrip from "@/components/TeamStrip";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[11px] uppercase tracking-widest text-muted">{label}</span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <span className="relative block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-lg border border-line bg-panel px-3 py-2.5 pr-8 text-sm font-medium text-ink hover:border-berry/40"
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-berry">▾</span>
    </span>
  );
}

export default function SettingsPanel({
  from,
  service,
  current,
  onFrom,
  onService,
  onCurrent,
  teams,
  onToggle,
  onAll,
  onNone,
}: {
  from: string;
  service: string;
  current: string;
  onFrom: (v: string) => void;
  onService: (v: string) => void;
  onCurrent: (v: string) => void;
  teams: Set<string>;
  onToggle: (code: string) => void;
  onAll: () => void;
  onNone: () => void;
}) {
  const myServices = servicesForCountry(from);
  return (
    <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3">
        <Field label="I am">
          <Select value={from} onChange={onFrom}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.demonym}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="I have">
          <Select value={service} onChange={onService}>
            {myServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id === "none" ? "— no subscription —" : s.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Watching in">
          <Select value={current} onChange={onCurrent}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <TeamStrip selected={teams} onToggle={onToggle} onAll={onAll} onNone={onNone} />
      </div>
    </div>
  );
}
