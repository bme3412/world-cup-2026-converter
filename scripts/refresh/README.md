# Rights refresh pipeline

Keeps the broadcast-rights data current over the tournament. It re-researches
each tracked country with the Anthropic API + web search, validates the output
against our `WatchOption` schema, **diffs against the committed data**, and emits
a review report. It never edits `lib/data/` — a human applies verified changes.

## Run locally

```bash
export ANTHROPIC_API_KEY=sk-ant-...
npm run refresh                       # all tracked countries
npm run refresh -- --countries=US,GB  # a subset
npm run refresh -- --limit=5          # first N (cost control)
npm run refresh -- --offline          # no API calls — exercises the diff machinery only
```

Output lands in `scripts/refresh/out/` (git-ignored):

- `report.md` — proposed rights changes per country **+ a Fixtures section**
- `proposed-rights.json` — the full freshly-researched `WatchOption[]` per country, to copy from

## Fixture validation

Every run also validates fixtures (`fixtures.ts`):

- **Structure** (always, no API) — every group has its 6 matches (72 total), each team plays 3,
  no duplicate pairings. Same invariants as `npm run check:fixtures`.
- **Schedule cross-check** (online) — an LLM + web-search pass confirms the kickoff time/venue of
  each match in the next ~10 days against the official schedule, flagging FIFA reschedules.

Both feed the report's **Fixtures** section; the run exits with a `fixture_issues` count for CI.

## How it decides

- **Model:** `claude-opus-4-8`, adaptive thinking, `web_search` server tool.
- **Seed sources:** the `sourceUrl`s already on each country's committed entries (plus the Wikipedia rights page) are handed to the researcher as anchors.
- **Validation (`schema.ts`):** every option must have a provider and a real `sourceUrl`, or it's dropped. Prices are only kept when well-formed. Unconfirmed claims come back as `confidence: "unknown"`.
- **Diff (`diff.ts`):** providers are matched by name; the report shows only adds/removes and price/kind/delivery shifts.

## Apply changes

1. Read `report.md`. For each proposed change, open the cited `sourceUrl` and confirm.
2. Edit `lib/data/rights.ts` (and `lib/data/services.ts` if a provider name changed, since `carries` must match exactly).
3. Bump `VERIFIED` in `rights.ts` and the footer date in `app/page.tsx`.

## Scheduling

`.github/workflows/refresh.yml` runs every Monday 09:00 UTC (and on-demand via
the Actions tab). It posts `report.md` to the job summary and uploads
`out/` as an artifact. Requires the `ANTHROPIC_API_KEY` repository secret.
Opening a PR automatically is a deliberate non-goal — rights changes should be
human-reviewed before they ship.
