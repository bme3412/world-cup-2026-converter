# beautifulgame2026 — match watch engine

**"Can I watch this match — where, and for how much?"** Tell it your nationality,
what subscription you have, and where you're watching from. It shows that day's
matches in your local time with the cheapest legal way to watch — and whether
your home subscription will work where you are.

Live at **[beautifulgame2026.com](https://beautifulgame2026.com)**.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## How it's built

- **Next.js (App Router) + TypeScript + Tailwind**, no backend (the app is fully client-side).
- **Time is stored once as UTC** (`Match.kickoffUtc`) and rendered per-timezone with
  `Intl.DateTimeFormat`. Local times are never stored — see `lib/time.ts`.
- **Rights data is the seam.** `lib/types.ts` defines `WatchOption` / `RightsTable` (keyed
  `country → match`). It's sourced country-level data in `lib/data/`, each claim carrying a
  `sourceUrl` + `lastVerifiedUtc`; the UI never depends on how it's produced.
- **The portability answer** is a rule, not a guess: free-to-air and most pay subscriptions
  geo-lock abroad, with an EU cross-border-portability carve-out (Reg. 2017/1128) encoded in
  `serviceVerdict`.
- **Vercel Analytics** is enabled via `@vercel/analytics` in `app/layout.tsx`.

## Coverage

36 viewing countries across Europe, the Americas, Asia-Pacific, Africa and the Middle East.
All **48 nations** are selectable in the team filter, covering every group-stage fixture in the
dataset. Rights are country-level and sourced; unknown match×country combinations show "check
local listings", never a guess. Most options carry a direct **Watch** link to the broadcaster's
official streaming page (`lib/data/watchUrls.ts`); a few are omitted rather than risk a dead link.

## Time-aware day view

Each day shows matches grouped by status: anything **yet to kick off** (or **live**, within ~2h of
kickoff) is featured prominently at the top; matches that have **already been played** drop below an
"Already played" divider, dimmed and marked "Full time". The day strip defaults to the first day
with upcoming matches. Everything derives from the single UTC kickoff and the current clock.

## Keeping data current

`scripts/refresh/` is a review-gated weekly pipeline: it re-researches each country's rights
with the Anthropic API + web search, validates against the `WatchOption` schema, diffs against
the committed data, and emits a report. It never edits `lib/data/` — a human applies verified
changes. Runs via `.github/workflows/refresh.yml` (needs an `ANTHROPIC_API_KEY` secret). See
`scripts/refresh/README.md`.

## Guardrails

Legal viewing paths only — free-to-air, services that genuinely travel, and where to subscribe
locally. No VPN / geo-block circumvention. No fabricated rights: unknown is shown as unknown.
