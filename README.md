# beautifulgame2026 — match watch engine

**"Can I watch this match — where, and for how much?"** Tell it your nationality,
what subscription you have, and where you're watching from. It shows that day's
matches in your local time with the cheapest legal way to watch — whether your
home subscription will work where you are — and lets you **add matches to your
calendar** with reminders.

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

**58 viewing countries** across North & South America, Europe, Africa, the Middle East,
Asia and Oceania — each with sourced country-level rights. The "I'm from / watching in"
dropdowns are **grouped by region** (`countriesByRegion()`) so the list stays scannable.
All **48 nations** are selectable in the team filter (with a **search box**). The dataset holds
the **complete 72-match group stage** (every group's six fixtures), so a given day shows *all*
its games — not just the ones involving popular teams. Unknown match×country combinations show
"check local listings", never a guess. Most options carry a direct **Watch** link to the
broadcaster's official streaming page (`lib/data/watchUrls.ts`); a few are omitted rather than
risk a dead link.

## Observability & monitoring

- **Fixture completeness** — `npm run check:fixtures` (`scripts/check-fixtures.ts`) verifies every
  group has its 6 matches (72 total), each team plays 3, no duplicate pairings, and every kickoff/
  timezone is valid. It runs as a **`prebuild` gate** (a broken dataset can't deploy) and in CI on
  every push (`.github/workflows/check.yml`). Update its `EXPECTED_*` constants when knockouts land.
- **Web Analytics** (Vercel, Pro) — custom events via `lib/analytics.ts`. Every event carries a
  consistent context (`watching_country`, `nationality`, `subscription`) **and a `source`**
  (utm_source or referrer host) so custom events are attributable, not just page views. The funnel
  is **page view → `ready_to_watch_shown` → `watch_option_clicked` / `calendar_exported` /
  `share_clicked`** (engagement is *not* defined by setup changes — the default state delivers value):
  - `ready_to_watch_shown` — the answer rendered (`verdict` + cheapest `option_type`); once per match/session
  - `watch_option_clicked` — provider + `option_type` (`included` / `free_ota` / `cable_required` / `paid_stream` …)
  - `source_clicked` · `calendar_exported` · `share_clicked` / `share_failed`
  - `country_selected` · `subscription_selected` · `nationality_selected` · `team_filter_selected` · `zero_results_shown`

  Page views (including every `/match/[id]` and `/watch/[country]`) are tracked automatically.
  **Attribution:** append `?utm_source=…&utm_medium=…&utm_campaign=…` to every shared link — Vercel
  captures UTMs on page views, and `lib/analytics.ts` folds `utm_source` into every custom event.
  View both in **Vercel → Analytics**.
- **Speed Insights** (Vercel) — real-user Core Web Vitals (LCP, CLS, INP, TTFB) via
  `@vercel/speed-insights` mounted in `app/layout.tsx`. View in **Vercel → Speed Insights**.
- **Share** uses the native Web Share sheet on mobile, falling back to clipboard.

## SEO

- **Per-match pages** — `/match/[id]` are statically generated (SSG, one per fixture) with
  `SportsEvent` JSON-LD, kickoff times across major timezones, and a where-to-watch table for every
  market. These target "Team vs Team — where to watch / TV channels" long-tail queries.
- **`/match`** — a static fixtures index linking every match (crawlable internal linking).
- **Country pages** — `/watch/[country]` (SSG, one per market) — "How to watch in {country}": channels,
  the cheapest legal way, and all fixtures in local time. Targets "how to watch in X" queries.
- **`robots.ts` + `sitemap.ts`** — sitemap lists the homepage, the index, all 72 match pages, and
  every country page. Set `GOOGLE_SITE_VERIFICATION` in Vercel env to emit the Search Console tag.
- **OG / Twitter cards** — `app/opengraph-image.tsx` renders a branded card via `next/og`; metadata
  set in `app/layout.tsx`.
- (Titles are trademark-safe — no "World Cup" — so we forgo those queries but keep the match/country
  long-tail.)

## Calendar

`lib/ics.ts` builds an `.ics` (client-side) with a 1-hour reminder per match and the cheapest
legal way to watch baked into the event. A per-match "📅 add" and a bulk "Add all [team] matches"
button download it; exports are traced via the `calendar_export` analytics event.

## Filter

Empty filter = **show all** (the default). You see a search box + a few popular quick-picks, and the
teams you choose appear as removable chips — never a wall of 48. Country dropdowns are region-grouped
and alphabetized within each group.

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
