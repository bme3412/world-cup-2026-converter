import type { Country, Region } from "@/lib/types";

// Markets we render times + rights for. `tz` is a representative zone used for
// "your local time"; `isEU` gates EU cross-border portability (Reg. 2017/1128);
// `region` groups the country dropdowns so the growing list stays scannable.
export const COUNTRIES: Country[] = [
  // ── North America ─────────────────────────────────────────────────────────
  { code: "US", name: "United States", demonym: "American", flag: "🇺🇸", tz: "America/New_York", currency: "USD", isEU: false, region: "North America" },
  { code: "CA", name: "Canada", demonym: "Canadian", flag: "🇨🇦", tz: "America/Toronto", currency: "CAD", isEU: false, region: "North America" },
  { code: "MX", name: "Mexico", demonym: "Mexican", flag: "🇲🇽", tz: "America/Mexico_City", currency: "MXN", isEU: false, region: "North America" },
  { code: "CR", name: "Costa Rica", demonym: "Costa Rican", flag: "🇨🇷", tz: "America/Costa_Rica", currency: "CRC", isEU: false, region: "North America" },
  { code: "PA", name: "Panama", demonym: "Panamanian", flag: "🇵🇦", tz: "America/Panama", currency: "USD", isEU: false, region: "North America" },

  // ── South America ─────────────────────────────────────────────────────────
  { code: "BR", name: "Brazil", demonym: "Brazilian", flag: "🇧🇷", tz: "America/Sao_Paulo", currency: "BRL", isEU: false, region: "South America" },
  { code: "AR", name: "Argentina", demonym: "Argentine", flag: "🇦🇷", tz: "America/Argentina/Buenos_Aires", currency: "ARS", isEU: false, region: "South America" },
  { code: "UY", name: "Uruguay", demonym: "Uruguayan", flag: "🇺🇾", tz: "America/Montevideo", currency: "UYU", isEU: false, region: "South America" },
  { code: "CO", name: "Colombia", demonym: "Colombian", flag: "🇨🇴", tz: "America/Bogota", currency: "COP", isEU: false, region: "South America" },
  { code: "CL", name: "Chile", demonym: "Chilean", flag: "🇨🇱", tz: "America/Santiago", currency: "CLP", isEU: false, region: "South America" },
  { code: "PE", name: "Peru", demonym: "Peruvian", flag: "🇵🇪", tz: "America/Lima", currency: "PEN", isEU: false, region: "South America" },
  { code: "EC", name: "Ecuador", demonym: "Ecuadorian", flag: "🇪🇨", tz: "America/Guayaquil", currency: "USD", isEU: false, region: "South America" },
  { code: "VE", name: "Venezuela", demonym: "Venezuelan", flag: "🇻🇪", tz: "America/Caracas", currency: "VES", isEU: false, region: "South America" },
  { code: "PY", name: "Paraguay", demonym: "Paraguayan", flag: "🇵🇾", tz: "America/Asuncion", currency: "PYG", isEU: false, region: "South America" },

  // ── Europe ────────────────────────────────────────────────────────────────
  { code: "GB", name: "United Kingdom", demonym: "British", flag: "🇬🇧", tz: "Europe/London", currency: "GBP", isEU: false, region: "Europe" },
  { code: "IE", name: "Ireland", demonym: "Irish", flag: "🇮🇪", tz: "Europe/Dublin", currency: "EUR", isEU: true, region: "Europe" },
  { code: "PT", name: "Portugal", demonym: "Portuguese", flag: "🇵🇹", tz: "Europe/Lisbon", currency: "EUR", isEU: true, region: "Europe" },
  { code: "ES", name: "Spain", demonym: "Spanish", flag: "🇪🇸", tz: "Europe/Madrid", currency: "EUR", isEU: true, region: "Europe" },
  { code: "FR", name: "France", demonym: "French", flag: "🇫🇷", tz: "Europe/Paris", currency: "EUR", isEU: true, region: "Europe" },
  { code: "DE", name: "Germany", demonym: "German", flag: "🇩🇪", tz: "Europe/Berlin", currency: "EUR", isEU: true, region: "Europe" },
  { code: "IT", name: "Italy", demonym: "Italian", flag: "🇮🇹", tz: "Europe/Rome", currency: "EUR", isEU: true, region: "Europe" },
  { code: "NL", name: "Netherlands", demonym: "Dutch", flag: "🇳🇱", tz: "Europe/Amsterdam", currency: "EUR", isEU: true, region: "Europe" },
  { code: "BE", name: "Belgium", demonym: "Belgian", flag: "🇧🇪", tz: "Europe/Brussels", currency: "EUR", isEU: true, region: "Europe" },
  { code: "AT", name: "Austria", demonym: "Austrian", flag: "🇦🇹", tz: "Europe/Vienna", currency: "EUR", isEU: true, region: "Europe" },
  { code: "CH", name: "Switzerland", demonym: "Swiss", flag: "🇨🇭", tz: "Europe/Zurich", currency: "CHF", isEU: false, region: "Europe" },
  { code: "GR", name: "Greece", demonym: "Greek", flag: "🇬🇷", tz: "Europe/Athens", currency: "EUR", isEU: true, region: "Europe" },
  { code: "HR", name: "Croatia", demonym: "Croatian", flag: "🇭🇷", tz: "Europe/Zagreb", currency: "EUR", isEU: true, region: "Europe" },
  { code: "PL", name: "Poland", demonym: "Polish", flag: "🇵🇱", tz: "Europe/Warsaw", currency: "PLN", isEU: true, region: "Europe" },
  { code: "RO", name: "Romania", demonym: "Romanian", flag: "🇷🇴", tz: "Europe/Bucharest", currency: "RON", isEU: true, region: "Europe" },
  { code: "CZ", name: "Czechia", demonym: "Czech", flag: "🇨🇿", tz: "Europe/Prague", currency: "CZK", isEU: true, region: "Europe" },
  { code: "HU", name: "Hungary", demonym: "Hungarian", flag: "🇭🇺", tz: "Europe/Budapest", currency: "HUF", isEU: true, region: "Europe" },
  { code: "RS", name: "Serbia", demonym: "Serbian", flag: "🇷🇸", tz: "Europe/Belgrade", currency: "RSD", isEU: false, region: "Europe" },
  { code: "UA", name: "Ukraine", demonym: "Ukrainian", flag: "🇺🇦", tz: "Europe/Kyiv", currency: "UAH", isEU: false, region: "Europe" },
  { code: "SE", name: "Sweden", demonym: "Swedish", flag: "🇸🇪", tz: "Europe/Stockholm", currency: "SEK", isEU: true, region: "Europe" },
  { code: "DK", name: "Denmark", demonym: "Danish", flag: "🇩🇰", tz: "Europe/Copenhagen", currency: "DKK", isEU: true, region: "Europe" },
  { code: "FI", name: "Finland", demonym: "Finnish", flag: "🇫🇮", tz: "Europe/Helsinki", currency: "EUR", isEU: true, region: "Europe" },
  { code: "NO", name: "Norway", demonym: "Norwegian", flag: "🇳🇴", tz: "Europe/Oslo", currency: "NOK", isEU: false, region: "Europe" },
  { code: "TR", name: "Türkiye", demonym: "Turkish", flag: "🇹🇷", tz: "Europe/Istanbul", currency: "TRY", isEU: false, region: "Europe" },

  // ── Africa ────────────────────────────────────────────────────────────────
  { code: "MA", name: "Morocco", demonym: "Moroccan", flag: "🇲🇦", tz: "Africa/Casablanca", currency: "MAD", isEU: false, region: "Africa" },
  { code: "ZA", name: "South Africa", demonym: "South African", flag: "🇿🇦", tz: "Africa/Johannesburg", currency: "ZAR", isEU: false, region: "Africa" },
  { code: "NG", name: "Nigeria", demonym: "Nigerian", flag: "🇳🇬", tz: "Africa/Lagos", currency: "NGN", isEU: false, region: "Africa" },
  { code: "EG", name: "Egypt", demonym: "Egyptian", flag: "🇪🇬", tz: "Africa/Cairo", currency: "EGP", isEU: false, region: "Africa" },

  // ── Middle East ───────────────────────────────────────────────────────────
  { code: "SA", name: "Saudi Arabia", demonym: "Saudi", flag: "🇸🇦", tz: "Asia/Riyadh", currency: "SAR", isEU: false, region: "Middle East" },
  { code: "AE", name: "United Arab Emirates", demonym: "Emirati", flag: "🇦🇪", tz: "Asia/Dubai", currency: "AED", isEU: false, region: "Middle East" },
  { code: "IL", name: "Israel", demonym: "Israeli", flag: "🇮🇱", tz: "Asia/Jerusalem", currency: "ILS", isEU: false, region: "Middle East" },

  // ── Asia ──────────────────────────────────────────────────────────────────
  { code: "JP", name: "Japan", demonym: "Japanese", flag: "🇯🇵", tz: "Asia/Tokyo", currency: "JPY", isEU: false, region: "Asia" },
  { code: "KR", name: "South Korea", demonym: "South Korean", flag: "🇰🇷", tz: "Asia/Seoul", currency: "KRW", isEU: false, region: "Asia" },
  { code: "CN", name: "China", demonym: "Chinese", flag: "🇨🇳", tz: "Asia/Shanghai", currency: "CNY", isEU: false, region: "Asia" },
  { code: "HK", name: "Hong Kong", demonym: "Hongkonger", flag: "🇭🇰", tz: "Asia/Hong_Kong", currency: "HKD", isEU: false, region: "Asia" },
  { code: "IN", name: "India", demonym: "Indian", flag: "🇮🇳", tz: "Asia/Kolkata", currency: "INR", isEU: false, region: "Asia" },
  { code: "ID", name: "Indonesia", demonym: "Indonesian", flag: "🇮🇩", tz: "Asia/Jakarta", currency: "IDR", isEU: false, region: "Asia" },
  { code: "TH", name: "Thailand", demonym: "Thai", flag: "🇹🇭", tz: "Asia/Bangkok", currency: "THB", isEU: false, region: "Asia" },
  { code: "VN", name: "Vietnam", demonym: "Vietnamese", flag: "🇻🇳", tz: "Asia/Ho_Chi_Minh", currency: "VND", isEU: false, region: "Asia" },
  { code: "PH", name: "Philippines", demonym: "Filipino", flag: "🇵🇭", tz: "Asia/Manila", currency: "PHP", isEU: false, region: "Asia" },
  { code: "MY", name: "Malaysia", demonym: "Malaysian", flag: "🇲🇾", tz: "Asia/Kuala_Lumpur", currency: "MYR", isEU: false, region: "Asia" },
  { code: "SG", name: "Singapore", demonym: "Singaporean", flag: "🇸🇬", tz: "Asia/Singapore", currency: "SGD", isEU: false, region: "Asia" },

  // ── Oceania ───────────────────────────────────────────────────────────────
  { code: "AU", name: "Australia", demonym: "Australian", flag: "🇦🇺", tz: "Australia/Sydney", currency: "AUD", isEU: false, region: "Oceania" },
  { code: "NZ", name: "New Zealand", demonym: "New Zealander", flag: "🇳🇿", tz: "Pacific/Auckland", currency: "NZD", isEU: false, region: "Oceania" },
];

export const COUNTRY_BY_CODE: Record<string, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c]),
);

export const REGION_ORDER: Region[] = [
  "North America",
  "South America",
  "Europe",
  "Africa",
  "Middle East",
  "Asia",
  "Oceania",
];

// Countries grouped by region, in REGION_ORDER, for grouped <optgroup> selects.
export function countriesByRegion(): { region: Region; countries: Country[] }[] {
  return REGION_ORDER.map((region) => ({
    region,
    countries: COUNTRIES.filter((c) => c.region === region),
  })).filter((g) => g.countries.length > 0);
}
