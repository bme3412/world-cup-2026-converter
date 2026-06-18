import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_COUNTRY_CODES } from "@/lib/data/rights";
import { GEO_COOKIE, COOKIE_MAX_AGE } from "@/lib/geo";

const FALLBACK = "US";

// Edge-detect the visitor's country and stash it in a cookie the homepage reads
// as its default "watching in" market. We deliberately do NOT redirect `/`:
// geo-redirecting the homepage risks cloaking and breaks indexability, and
// Googlebot crawls mostly from the US. The response body is identical for every
// visitor (the cookie just changes a client default), so `/` stays cacheable and
// bots still reach all canonical `/watch/[country]` pages for indexing.
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // `x-vercel-ip-country` is set by Vercel's edge from the client IP. We prefer
  // it over the deprecated `NextRequest.geo` (removed in Next 15).
  const detected = (req.headers.get("x-vercel-ip-country") || "").toUpperCase();

  // Map detected -> a market we actually have a page for; otherwise US, so the
  // visitor never gets a broken/empty experience.
  const resolved = SUPPORTED_COUNTRY_CODES.has(detected) ? detected : FALLBACK;

  // Not httpOnly: the client component needs to read it. The homepage treats this
  // strictly as a default — an explicit `?loc=` or a saved manual pick overrides it.
  res.cookies.set(GEO_COOKIE, resolved, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    httpOnly: false,
  });

  return res;
}

export const config = {
  // Only the homepage consumes the geo hint; every other route is already
  // country-scoped by its URL, so we keep the edge footprint to `/`.
  matcher: ["/"],
};
