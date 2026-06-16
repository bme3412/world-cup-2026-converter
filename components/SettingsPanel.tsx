"use client";

import { countriesByRegion } from "@/lib/data/countries";
import type { Country } from "@/lib/types";
import { servicesForCountry } from "@/lib/data/services";
import TeamFilter from "@/components/TeamFilter";

function CountryOptions({ label }: { label: (c: Country) => string }) {
  return (
    <>
      {countriesByRegion().map((g) => (
        <optgroup key={g.region} label={g.region}>
          {g.countries
            .slice()
            .sort((a, b) => label(a).localeCompare(label(b)))
            .map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {label(c)}
              </option>
            ))}
        </optgroup>
      ))}
    </>
  );
}

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
  onClear,
}: {
  from: string;
  service: string;
  current: string;
  onFrom: (v: string) => void;
  onService: (v: string) => void;
  onCurrent: (v: string) => void;
  teams: Set<string>;
  onToggle: (code: string) => void;
  onClear: () => void;
}) {
  const myServices = servicesForCountry(from);
  return (
    <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3">
        <Field label="I am">
          <Select value={from} onChange={onFrom}>
            <CountryOptions label={(c) => c.demonym} />
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
            <CountryOptions label={(c) => c.name} />
          </Select>
        </Field>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <TeamFilter selected={teams} onToggle={onToggle} onClear={onClear} />
      </div>
    </div>
  );
}
