// Weekly refresh pipeline orchestrator.
//
//   npm run refresh                       # all countries
//   npm run refresh -- --countries=US,GB  # a subset
//   npm run refresh -- --limit=5          # first N (cost control)
//   npm run refresh -- --offline          # no API calls; validate diff machinery only
//
// Needs ANTHROPIC_API_KEY (except --offline). Writes scripts/refresh/out/.
// Never mutates lib/data — review the report, then apply by hand.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { COUNTRIES } from "@/lib/data/countries";
import { COUNTRY_RIGHTS } from "@/lib/data/rights";
import type { Country } from "@/lib/types";
import { researchCountry, type CountryResearch } from "./research";
import { diffCountry } from "./diff";
import { renderReport, type FixtureReport } from "./report";
import { checkStructure, crossCheckSchedule } from "./fixtures";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");
const CONCURRENCY = 4;

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (k: string) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
  return {
    offline: args.includes("--offline"),
    countries: get("countries")?.split(",").map((c) => c.trim().toUpperCase()),
    limit: get("limit") ? Number(get("limit")) : undefined,
  };
}

// Seed the researcher with the sourceUrls already on file for that country.
function seedSources(code: string): string[] {
  const opts = COUNTRY_RIGHTS[code] ?? [];
  const urls = Array.from(new Set(opts.map((o) => o.sourceUrl).filter((u): u is string => !!u)));
  return urls.length ? urls : ["https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights"];
}

async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

async function main() {
  const { offline, countries, limit } = parseArgs();
  const stamp = new Date().toISOString();

  let targets: Country[] = COUNTRIES.filter((c) => COUNTRY_RIGHTS[c.code]); // only countries we already track
  if (countries) targets = targets.filter((c) => countries.includes(c.code));
  if (limit) targets = targets.slice(0, limit);

  mkdirSync(OUT_DIR, { recursive: true });

  let client: Anthropic | null = null;
  let research: CountryResearch[];
  if (offline) {
    console.log(`[offline] validating machinery against committed data for ${targets.length} countries (no API calls).`);
    research = targets.map((c) => ({ country: c.code, options: COUNTRY_RIGHTS[c.code], dropped: [] }));
  } else {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set. Set it, or run with --offline.");
      process.exit(1);
    }
    client = new Anthropic();
    console.log(`Researching ${targets.length} countries (concurrency ${CONCURRENCY})…`);
    research = await pool(targets, CONCURRENCY, async (c) => {
      const r = await researchCountry(client!, c, seedSources(c.code), stamp);
      const status = r.error ? `ERROR ${r.error}` : `${r.options.length} options${r.dropped.length ? `, dropped ${r.dropped.length}` : ""}`;
      console.log(`  ${c.code}: ${status}`);
      return r;
    });
  }

  const diffs = research.map((r) =>
    diffCountry(r.country, COUNTRY_RIGHTS[r.country] ?? [], r.options, r.error),
  );

  // Validate fixtures: structure always; schedule cross-check when online.
  console.log("Validating fixtures…");
  const fixtures: FixtureReport = {
    structural: checkStructure(),
    discrepancies: client ? await crossCheckSchedule(client, 10, new Date(stamp).getTime()) : [],
  };
  console.log(`  structure: ${fixtures.structural.length ? `${fixtures.structural.length} issue(s)` : "OK"}; schedule discrepancies: ${fixtures.discrepancies.length}`);

  const report = renderReport(diffs, stamp, fixtures);
  const proposed = Object.fromEntries(research.map((r) => [r.country, r.options]));

  writeFileSync(join(OUT_DIR, "report.md"), report);
  writeFileSync(join(OUT_DIR, "proposed-rights.json"), JSON.stringify(proposed, null, 2));

  const totalChanges = diffs.reduce((n, d) => n + d.changes.length, 0);
  const fixtureIssues = fixtures.structural.length + fixtures.discrepancies.length;
  console.log(`\nDone. ${totalChanges} rights change(s), ${fixtureIssues} fixture issue(s). Report: scripts/refresh/out/report.md`);

  // Expose a one-line summary for CI step output.
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, `changes=${totalChanges}\nfixture_issues=${fixtureIssues}\n`, { flag: "a" });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
