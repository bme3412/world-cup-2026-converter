// Subscription / viewing setups a fan might already have, by home market. The
// portability question — "does my setup work where I'm travelling?" — is the
// core of the product.
//
// `carries` lists provider names (matching the RightsTable EXACTLY) this setup
// gives you in its home country. `travelsAbroad` is almost always false: free-
// to-air and live-TV streaming geo-lock outside their home market. `euPortable`
// = a paid EU subscription usable in other EU countries (Reg. 2017/1128).

export type Service = {
  id: string;
  name: string;
  homeCountry: string; // where this setup works ("" = none, shown everywhere)
  travelsAbroad: boolean;
  euPortable?: boolean;
  carries: string[];
};

export const SERVICES: Service[] = [
  // Universal
  { id: "none", name: "no subscription", homeCountry: "", travelsAbroad: false, carries: [] },

  // United States
  { id: "ytv", name: "YouTube TV", homeCountry: "US", travelsAbroad: false, carries: ["FOX / FS1", "Telemundo / Universo"] },
  { id: "hulu", name: "Hulu + Live TV", homeCountry: "US", travelsAbroad: false, carries: ["FOX / FS1", "Telemundo / Universo"] },
  { id: "fubo", name: "Fubo", homeCountry: "US", travelsAbroad: false, carries: ["FOX / FS1", "Telemundo / Universo"] },
  { id: "sling", name: "Sling TV", homeCountry: "US", travelsAbroad: false, carries: ["FOX / FS1"] },
  { id: "fox-one", name: "FOX One", homeCountry: "US", travelsAbroad: false, carries: ["FOX One"] },
  { id: "peacock", name: "Peacock", homeCountry: "US", travelsAbroad: false, carries: ["Peacock"] },

  // United Kingdom
  { id: "uk-fta", name: "BBC iPlayer / ITVX (free-to-air)", homeCountry: "GB", travelsAbroad: false, carries: ["BBC", "ITV"] },

  // Canada
  { id: "ca-tsn", name: "TSN / TSN+", homeCountry: "CA", travelsAbroad: false, carries: ["TSN", "CTV"] },
  { id: "ca-rds", name: "RDS", homeCountry: "CA", travelsAbroad: false, carries: ["RDS", "Noovo"] },

  // Mexico
  { id: "mx-fta", name: "Televisa / TV Azteca (free)", homeCountry: "MX", travelsAbroad: false, carries: ["Televisa (Canal 5 / Las Estrellas)", "TV Azteca (Azteca 7)"] },
  { id: "mx-vix", name: "ViX Premium", homeCountry: "MX", travelsAbroad: false, carries: ["ViX"] },

  // Brazil
  { id: "br-globo", name: "TV Globo (free-to-air)", homeCountry: "BR", travelsAbroad: false, carries: ["TV Globo"] },
  { id: "br-globoplay", name: "Globoplay / SporTV", homeCountry: "BR", travelsAbroad: false, carries: ["SporTV", "TV Globo"] },

  // France
  { id: "fr-m6", name: "M6 (free-to-air)", homeCountry: "FR", travelsAbroad: false, carries: ["M6"] },
  { id: "fr-bein", name: "beIN Sports", homeCountry: "FR", travelsAbroad: false, euPortable: true, carries: ["beIN Sports"] },

  // Germany
  { id: "de-fta", name: "ARD / ZDF (free-to-air)", homeCountry: "DE", travelsAbroad: false, carries: ["ARD", "ZDF"] },
  { id: "de-magenta", name: "MagentaTV", homeCountry: "DE", travelsAbroad: false, euPortable: true, carries: ["MagentaTV"] },

  // Spain
  { id: "es-rtve", name: "RTVE (free-to-air)", homeCountry: "ES", travelsAbroad: false, carries: ["RTVE"] },
  { id: "es-dazn", name: "DAZN", homeCountry: "ES", travelsAbroad: false, euPortable: true, carries: ["DAZN"] },

  // Portugal
  { id: "pt-fta", name: "RTP / SIC / TVI (free-to-air)", homeCountry: "PT", travelsAbroad: false, carries: ["RTP", "SIC", "TVI"] },
  { id: "pt-sporttv", name: "Sport TV", homeCountry: "PT", travelsAbroad: false, euPortable: true, carries: ["Sport TV"] },

  // Poland
  { id: "pl-tvp", name: "TVP (free-to-air)", homeCountry: "PL", travelsAbroad: false, carries: ["TVP"] },

  // Japan
  { id: "jp-fta", name: "NHK / Nippon TV / Fuji TV (free)", homeCountry: "JP", travelsAbroad: false, carries: ["NHK", "Nippon TV", "Fuji TV"] },
  { id: "jp-abema", name: "ABEMA (free)", homeCountry: "JP", travelsAbroad: false, carries: ["ABEMA"] },
  { id: "jp-dazn", name: "DAZN", homeCountry: "JP", travelsAbroad: false, carries: ["DAZN"] },
];

export const SERVICE_BY_ID: Record<string, Service> = Object.fromEntries(
  SERVICES.map((s) => [s.id, s]),
);

// The "I have …" choices for a nationality: that country's setups, then "none".
export function servicesForCountry(countryCode: string): Service[] {
  const local = SERVICES.filter((s) => s.homeCountry === countryCode);
  return [...local, SERVICE_BY_ID["none"]];
}

// Sensible default "I have" for a nationality (first local setup, else none).
export function defaultServiceFor(countryCode: string): string {
  return SERVICES.find((s) => s.homeCountry === countryCode)?.id ?? "none";
}
