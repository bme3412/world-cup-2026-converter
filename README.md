# Far Post — World Cup 2026 watch engine (Phase 0 MVP)

**"Can I watch this match — where, and for how much?"** Pick your teams, set where you are, and see
every match in your local time with the cheapest legal way to watch it. Change your location and the
times, channels and prices all recompute.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Deploy

Push to a Git repo and import it on [Vercel](https://vercel.com/new) — it auto-detects Next.js, no
config needed. Or `npx vercel` from this directory.

## How it's built

- **Next.js (App Router) + TypeScript + Tailwind**, no backend (Phase 0 is fully client-side).
- **Time is stored once as UTC** (`Match.kickoffUtc`) and rendered per-timezone with
  `Intl.DateTimeFormat`. Local times are never stored — see `lib/time.ts`.
- **The rights data is the seam.** `lib/types.ts` defines `WatchOption` / `RightsTable` (keyed
  `country → match`, because channels vary per match within a country). Today it's hand-built sample
  JSON in `lib/data/`; a later phase swaps that module for an API / LLM pipeline **without touching
  the UI**.

### Model choices folded in beyond the base spec

- `WatchOption.travelsWithUser` — does a home subscription keep working abroad? Free-to-air and most
  home OTT subs are geo-blocked, so this is the honest default and drives the **travel note**.
- `WatchOption.confidence` (`verified | sample | unknown`) + `lastVerifiedUtc` — trust is shown, not
  assumed. Unknown match×country combos render **"check local listings"**, never a guess.
- Shareable **URL state** (`?teams=ARG,POR&loc=US&home=PT`) — every view is a link.

## Guardrails

Legal viewing paths only — free-to-air, services that genuinely travel, and where to subscribe
locally. No VPN / geo-block circumvention. No fabricated rights: unknown is shown as unknown.

## Not yet (Phase 1+)

Live fixtures feed, geolocation, persisted favorites, `.ics` calendar export, and the AI layer
(natural-language queries + the rights-normalization pipeline).
