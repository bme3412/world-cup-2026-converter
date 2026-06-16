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

  // Italy
  { id: "it-rai", name: "RAI (free-to-air)", homeCountry: "IT", travelsAbroad: false, carries: ["RAI"] },
  { id: "it-dazn", name: "DAZN", homeCountry: "IT", travelsAbroad: false, euPortable: true, carries: ["DAZN"] },
  // Netherlands
  { id: "nl-nos", name: "NPO / NOS (free-to-air)", homeCountry: "NL", travelsAbroad: false, carries: ["NOS (NPO)"] },
  // Belgium
  { id: "be-fta", name: "VRT / RTBF (free-to-air)", homeCountry: "BE", travelsAbroad: false, carries: ["VRT (Sporza)", "RTBF (Auvio)"] },
  // Ireland
  { id: "ie-rte", name: "RTÉ (free-to-air)", homeCountry: "IE", travelsAbroad: false, carries: ["RTÉ"] },
  // Austria
  { id: "at-fta", name: "ORF / ServusTV (free-to-air)", homeCountry: "AT", travelsAbroad: false, carries: ["ORF", "ServusTV"] },
  { id: "at-magenta", name: "Magenta TV WM-Spezial", homeCountry: "AT", travelsAbroad: false, euPortable: true, carries: ["Magenta TV WM-Spezial"] },
  // Greece
  { id: "gr-ert", name: "ERT (free-to-air)", homeCountry: "GR", travelsAbroad: false, carries: ["ERT"] },
  // Croatia
  { id: "hr-hrt", name: "HRT (free-to-air)", homeCountry: "HR", travelsAbroad: false, carries: ["HRT"] },
  // Sweden
  { id: "se-fta", name: "SVT / TV4 (free-to-air)", homeCountry: "SE", travelsAbroad: false, carries: ["SVT", "TV4"] },
  // Denmark
  { id: "dk-fta", name: "DR / TV2 (free-to-air)", homeCountry: "DK", travelsAbroad: false, carries: ["DR", "TV2"] },
  // Finland
  { id: "fi-yle", name: "Yle (free-to-air)", homeCountry: "FI", travelsAbroad: false, carries: ["Yle"] },
  { id: "fi-mtv", name: "MTV Katsomo+", homeCountry: "FI", travelsAbroad: false, euPortable: true, carries: ["MTV"] },
  // Switzerland
  { id: "ch-srg", name: "SRG SSR (free-to-air)", homeCountry: "CH", travelsAbroad: false, carries: ["SRG SSR (SRF / RTS / RSI)"] },
  // Norway
  { id: "no-nrk", name: "NRK (free-to-air)", homeCountry: "NO", travelsAbroad: false, carries: ["NRK"] },
  { id: "no-tv2", name: "TV 2 Play", homeCountry: "NO", travelsAbroad: false, carries: ["TV 2 (TV 2 Play)"] },
  // Türkiye
  { id: "tr-trt", name: "TRT (free-to-air)", homeCountry: "TR", travelsAbroad: false, carries: ["TRT (TRT 1 / TRT Spor)"] },
  // Argentina
  { id: "ar-fta", name: "Telefe / TV Pública (free-to-air)", homeCountry: "AR", travelsAbroad: false, carries: ["Telefe", "TV Pública"] },
  { id: "ar-tyc", name: "TyC Sports", homeCountry: "AR", travelsAbroad: false, carries: ["TyC Sports"] },
  { id: "ar-dsports", name: "DSports (DirecTV)", homeCountry: "AR", travelsAbroad: false, carries: ["DSports (DirecTV / DGO)"] },
  // Uruguay
  { id: "uy-fta", name: "Canal 5 / Antel TV (free)", homeCountry: "UY", travelsAbroad: false, carries: ["Canal 5 (TNU)", "Antel TV"] },
  { id: "uy-dsports", name: "DSports (DirecTV)", homeCountry: "UY", travelsAbroad: false, carries: ["DSports (DirecTV / DGO)"] },
  // Colombia
  { id: "co-fta", name: "Caracol / RCN (free-to-air)", homeCountry: "CO", travelsAbroad: false, carries: ["Caracol Televisión", "Canal RCN"] },
  { id: "co-win", name: "Win Sports+", homeCountry: "CO", travelsAbroad: false, carries: ["Win Sports"] },
  { id: "co-dsports", name: "DSports (DirecTV)", homeCountry: "CO", travelsAbroad: false, carries: ["DSports (DirecTV / DGO)"] },
  // Chile
  { id: "cl-chv", name: "Chilevisión (free-to-air)", homeCountry: "CL", travelsAbroad: false, carries: ["Chilevisión"] },
  { id: "cl-dsports", name: "DSports / DGO", homeCountry: "CL", travelsAbroad: false, carries: ["DSports (DirecTV / DGO)"] },
  // Australia
  { id: "au-sbs", name: "SBS (free-to-air)", homeCountry: "AU", travelsAbroad: false, carries: ["SBS"] },
  // South Korea
  { id: "kr-kbs", name: "KBS (free-to-air)", homeCountry: "KR", travelsAbroad: false, carries: ["KBS"] },
  { id: "kr-jtbc", name: "JTBC", homeCountry: "KR", travelsAbroad: false, carries: ["JTBC"] },
  // India
  { id: "in-zee5", name: "ZEE5 / Unite8 Sports", homeCountry: "IN", travelsAbroad: false, carries: ["ZEE5", "Unite8 Sports (Zee)"] },
  // China
  { id: "cn-cctv", name: "CCTV (free)", homeCountry: "CN", travelsAbroad: false, carries: ["CMG / CCTV", "Xiaohongshu / RedNote"] },
  { id: "cn-migu", name: "Migu Video", homeCountry: "CN", travelsAbroad: false, carries: ["Migu Video"] },
  // Morocco
  { id: "ma-snrt", name: "SNRT (free-to-air)", homeCountry: "MA", travelsAbroad: false, carries: ["SNRT (Al Aoula / Arryadia)"] },
  { id: "ma-bein", name: "beIN Sports / TOD", homeCountry: "MA", travelsAbroad: false, carries: ["beIN Sports"] },
  // South Africa
  { id: "za-sabc", name: "SABC (free-to-air)", homeCountry: "ZA", travelsAbroad: false, carries: ["SABC"] },
  { id: "za-supersport", name: "SuperSport (DStv)", homeCountry: "ZA", travelsAbroad: false, carries: ["SuperSport (DStv)"] },
  // Saudi Arabia
  { id: "sa-ssc", name: "SSC (free-to-air)", homeCountry: "SA", travelsAbroad: false, carries: ["SSC (Saudi Sports Company)"] },
  { id: "sa-bein", name: "beIN Sports / TOD", homeCountry: "SA", travelsAbroad: false, carries: ["beIN Sports"] },
  // Nigeria
  { id: "ng-nta", name: "NTA (free-to-air)", homeCountry: "NG", travelsAbroad: false, carries: ["NTA"] },
  { id: "ng-supersport", name: "SuperSport (DStv/GOtv)", homeCountry: "NG", travelsAbroad: false, carries: ["SuperSport (DStv/GOtv/Showmax)"] },
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
