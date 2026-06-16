import type { Country } from "@/lib/types";

// Markets we have a (sample) RightsTable for. `tz` is a representative zone used
// to render "your local time" — a real version would refine this by city.
export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", demonym: "American", flag: "🇺🇸", tz: "America/New_York", currency: "USD", isEU: false },
  { code: "GB", name: "United Kingdom", demonym: "British", flag: "🇬🇧", tz: "Europe/London", currency: "GBP", isEU: false },
  { code: "PT", name: "Portugal", demonym: "Portuguese", flag: "🇵🇹", tz: "Europe/Lisbon", currency: "EUR", isEU: true },
  { code: "ES", name: "Spain", demonym: "Spanish", flag: "🇪🇸", tz: "Europe/Madrid", currency: "EUR", isEU: true },
  { code: "FR", name: "France", demonym: "French", flag: "🇫🇷", tz: "Europe/Paris", currency: "EUR", isEU: true },
  { code: "DE", name: "Germany", demonym: "German", flag: "🇩🇪", tz: "Europe/Berlin", currency: "EUR", isEU: true },
  { code: "PL", name: "Poland", demonym: "Polish", flag: "🇵🇱", tz: "Europe/Warsaw", currency: "PLN", isEU: true },
  { code: "JP", name: "Japan", demonym: "Japanese", flag: "🇯🇵", tz: "Asia/Tokyo", currency: "JPY", isEU: false },
  { code: "MX", name: "Mexico", demonym: "Mexican", flag: "🇲🇽", tz: "America/Mexico_City", currency: "MXN", isEU: false },
  { code: "CA", name: "Canada", demonym: "Canadian", flag: "🇨🇦", tz: "America/Toronto", currency: "CAD", isEU: false },
  { code: "BR", name: "Brazil", demonym: "Brazilian", flag: "🇧🇷", tz: "America/Sao_Paulo", currency: "BRL", isEU: false },
];

export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);
