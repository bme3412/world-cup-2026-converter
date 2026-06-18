// Geo-personalization plumbing shared by the edge middleware and the homepage.
//
// The middleware writes the visitor's resolved country into `bg_geo` (a hint,
// never a redirect — `/` stays crawlable & cacheable). The homepage reads it as
// the *default* "watching in" country, but an explicit `?loc=` or a manual pick
// (persisted in `bg_loc`) always wins. Geo-IP is ~80% accurate, so the choice
// must be easy to override and the override must stick.

export const GEO_COOKIE = "bg_geo"; // edge geo hint (where Vercel thinks you are)
export const LOC_COOKIE = "bg_loc"; // explicit user choice — wins over geo, persists
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

// These functions are only meaningful in the browser; they no-op on the server
// (so the module is safe to import from the edge middleware, which never calls them).
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export function writeCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}
