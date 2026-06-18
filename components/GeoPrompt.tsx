"use client";

import { useState } from "react";
import Link from "next/link";
import type { Country } from "@/lib/types";

// A soft, dismissible strip that (1) confirms the country we're defaulting to —
// geo-IP is only ~80% accurate, so we never trap the visitor in a silent guess —
// and (2) links to that market's full `/watch/[country]` guide. That link is what
// restores in-app navigation to the country pages (they had collapsed to ~6%) and
// makes `/watch/in`, `/watch/fr`, … show up in the logs instead of only `/watch/us`.
export default function GeoPrompt({
  country,
  supported,
  onChange,
  onGuide,
}: {
  country: Country;
  supported: boolean;
  onChange: () => void;
  onGuide: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="-mx-4 mb-3 flex items-center gap-2 border-b border-line bg-wash/40 px-4 py-2 font-mono text-[11px] text-muted">
      <span aria-hidden>📍</span>
      <p className="min-w-0 flex-1 leading-snug">
        Showing options for {country.flag}{" "}
        <span className="font-semibold text-ink">{country.name}</span>.{" "}
        {supported ? (
          <Link
            href={`/watch/${country.code.toLowerCase()}`}
            onClick={onGuide}
            className="text-berry hover:underline"
          >
            See the full {country.name} guide →
          </Link>
        ) : null}
      </p>
      <button
        onClick={onChange}
        className="shrink-0 uppercase tracking-wide text-berry hover:underline"
      >
        Not here?
      </button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="shrink-0 px-1 text-muted hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}
