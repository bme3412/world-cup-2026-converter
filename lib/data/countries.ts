import type { Country } from "@/lib/types";

// Markets we render times + rights for. `tz` is a representative zone used for
// "your local time"; `isEU` gates EU cross-border portability (Reg. 2017/1128).
export const COUNTRIES: Country[] = [
  // ── Original 11 ───────────────────────────────────────────────────────────
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

  // ── Rest of Europe (EU) ───────────────────────────────────────────────────
  { code: "IT", name: "Italy", demonym: "Italian", flag: "🇮🇹", tz: "Europe/Rome", currency: "EUR", isEU: true },
  { code: "NL", name: "Netherlands", demonym: "Dutch", flag: "🇳🇱", tz: "Europe/Amsterdam", currency: "EUR", isEU: true },
  { code: "BE", name: "Belgium", demonym: "Belgian", flag: "🇧🇪", tz: "Europe/Brussels", currency: "EUR", isEU: true },
  { code: "IE", name: "Ireland", demonym: "Irish", flag: "🇮🇪", tz: "Europe/Dublin", currency: "EUR", isEU: true },
  { code: "AT", name: "Austria", demonym: "Austrian", flag: "🇦🇹", tz: "Europe/Vienna", currency: "EUR", isEU: true },
  { code: "GR", name: "Greece", demonym: "Greek", flag: "🇬🇷", tz: "Europe/Athens", currency: "EUR", isEU: true },
  { code: "HR", name: "Croatia", demonym: "Croatian", flag: "🇭🇷", tz: "Europe/Zagreb", currency: "EUR", isEU: true },
  { code: "SE", name: "Sweden", demonym: "Swedish", flag: "🇸🇪", tz: "Europe/Stockholm", currency: "SEK", isEU: true },
  { code: "DK", name: "Denmark", demonym: "Danish", flag: "🇩🇰", tz: "Europe/Copenhagen", currency: "DKK", isEU: true },
  { code: "FI", name: "Finland", demonym: "Finnish", flag: "🇫🇮", tz: "Europe/Helsinki", currency: "EUR", isEU: true },

  // ── Non-EU Europe ─────────────────────────────────────────────────────────
  { code: "CH", name: "Switzerland", demonym: "Swiss", flag: "🇨🇭", tz: "Europe/Zurich", currency: "CHF", isEU: false },
  { code: "NO", name: "Norway", demonym: "Norwegian", flag: "🇳🇴", tz: "Europe/Oslo", currency: "NOK", isEU: false },
  { code: "TR", name: "Türkiye", demonym: "Turkish", flag: "🇹🇷", tz: "Europe/Istanbul", currency: "TRY", isEU: false },

  // ── Americas ──────────────────────────────────────────────────────────────
  { code: "AR", name: "Argentina", demonym: "Argentine", flag: "🇦🇷", tz: "America/Argentina/Buenos_Aires", currency: "ARS", isEU: false },
  { code: "UY", name: "Uruguay", demonym: "Uruguayan", flag: "🇺🇾", tz: "America/Montevideo", currency: "UYU", isEU: false },
  { code: "CO", name: "Colombia", demonym: "Colombian", flag: "🇨🇴", tz: "America/Bogota", currency: "COP", isEU: false },
  { code: "CL", name: "Chile", demonym: "Chilean", flag: "🇨🇱", tz: "America/Santiago", currency: "CLP", isEU: false },

  // ── Asia-Pacific, Africa & Middle East ────────────────────────────────────
  { code: "AU", name: "Australia", demonym: "Australian", flag: "🇦🇺", tz: "Australia/Sydney", currency: "AUD", isEU: false },
  { code: "KR", name: "South Korea", demonym: "South Korean", flag: "🇰🇷", tz: "Asia/Seoul", currency: "KRW", isEU: false },
  { code: "IN", name: "India", demonym: "Indian", flag: "🇮🇳", tz: "Asia/Kolkata", currency: "INR", isEU: false },
  { code: "CN", name: "China", demonym: "Chinese", flag: "🇨🇳", tz: "Asia/Shanghai", currency: "CNY", isEU: false },
  { code: "MA", name: "Morocco", demonym: "Moroccan", flag: "🇲🇦", tz: "Africa/Casablanca", currency: "MAD", isEU: false },
  { code: "ZA", name: "South Africa", demonym: "South African", flag: "🇿🇦", tz: "Africa/Johannesburg", currency: "ZAR", isEU: false },
  { code: "SA", name: "Saudi Arabia", demonym: "Saudi", flag: "🇸🇦", tz: "Asia/Riyadh", currency: "SAR", isEU: false },
  { code: "NG", name: "Nigeria", demonym: "Nigerian", flag: "🇳🇬", tz: "Africa/Lagos", currency: "NGN", isEU: false },
];

export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);
