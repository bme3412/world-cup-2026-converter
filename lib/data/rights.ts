import type { Confidence, Price, RightsTable, WatchOption } from "@/lib/types";
import { MATCHES } from "@/lib/data/matches";

// ─────────────────────────────────────────────────────────────────────────────
// REAL 2026 tournament broadcast rights, country-level (applied to every match).
// Researched 2026-06-15 from the relevant broadcasting-rights references, FIFA
// media-rights releases, and broadcaster announcements; each option carries its
// sourceUrl. This is the seed the refresh pipeline maintains.
//
// Country-level is deliberate: most rights are tournament-wide per market.
// Per-match channel splits (which slot on which sister channel) are a later
// refinement layered as overrides — they don't change the headline answer.
// ─────────────────────────────────────────────────────────────────────────────

const VERIFIED = "2026-06-15T00:00:00Z";

type Opt = WatchOption;

const o = (
  p: Pick<Opt, "provider" | "kind"> &
    Partial<Opt> & { source: string; confidence?: Confidence; price?: Price },
): Opt => ({
  delivery: ["tv"],
  travelsWithUser: false,
  confidence: p.confidence ?? "verified",
  lastVerifiedUtc: VERIFIED,
  sourceUrl: p.source,
  ...p,
});

// Country-level rights holders. Provider strings MUST match `carries` in
// lib/data/services.ts so the "does my subscription work?" verdict can resolve.
const BASE: Record<string, Opt[]> = {
  US: [
    o({ provider: "FOX / FS1", kind: "free", delivery: ["tv", "stream"], note: "English. FOX is free over-the-air; FS1 needs cable; all matches stream on the FOX Sports app with a TV-provider login", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
    o({ provider: "FOX One", kind: "paid", delivery: ["stream"], price: { amount: 19.99, currency: "USD", period: "month" }, note: "English; new standalone streaming service, all 104 matches", source: "https://thedesk.net/2026/06/cheapest-way-stream-watch-2026-world-cup/" }),
    o({ provider: "Telemundo / Universo", kind: "free", delivery: ["tv", "stream"], note: "Spanish. Telemundo free over-the-air; Universo needs cable", source: "https://deadline.com/2026/06/world-cup-fox-telemundo-peacock-tv-streaming-1236951939/" }),
    o({ provider: "Peacock", kind: "paid", delivery: ["stream"], price: { amount: 10.99, currency: "USD", period: "month" }, note: "Spanish; all 104 matches", source: "https://www.gamesradar.com/peacock-tv-costs-peacock-premium-prices-nbc-streaming-service/" }),
    o({ provider: "Tubi", kind: "free", delivery: ["stream"], note: "Selected matches, free with ads", source: "https://sports.yahoo.com/soccer/article/ways-to-watch-the-2026-world-cup-for-free-184500405.html" }),
  ],
  GB: [
    o({ provider: "BBC", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air on BBC One/Two & iPlayer; shares matches with ITV incl. the final", source: "https://inside.fifa.com/tournament-organisation/commercial/news/uk-media-rights-2026-2030-world-cups-bbc-itv" }),
    o({ provider: "ITV", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air on ITV1/ITVX; opens the tournament, shares the final", source: "https://www.itv.com/presscentre/media-releases/itv-and-bbc-reveal-blockbuster-match-split-fifa-world-cup-2026" }),
  ],
  CA: [
    o({ provider: "CTV", kind: "free", delivery: ["tv", "stream"], note: "English free-to-air subset: all Canada matches, all quarter-finals, semis & final", source: "https://www.sportsvideo.org/2026/06/04/bell-media-to-carry-all-104-fifa-world-cup-2026-matches-across-tsn-rds-and-streaming-platforms/" }),
    o({ provider: "Noovo", kind: "free", delivery: ["tv", "stream"], note: "French free-to-air; all Canada matches plus the final", source: "https://www.goal.com/en-ca/news/tsn-ctv-rds-watch-and-live-stream-fifa-world-cup-2026-canada/blt9b2d846001b1c908" }),
    o({ provider: "TSN", kind: "paid", delivery: ["tv", "stream"], note: "English; all 104 matches across TSN1–5 & TSN+. Cable/subscription", source: "https://www.bellmedia.ca/the-lede/press/bell-media-is-canadas-destination-for-every-fifa-world-cup-2026-moment/" }),
    o({ provider: "RDS", kind: "paid", delivery: ["tv", "stream"], note: "French; all 104 matches. Cable/subscription", source: "https://www.tsn.ca/soccer/fifa-world-cup/article/bell-media-is-canadas-destination-for-every-fifa-world-cup-2026-moment/" }),
  ],
  MX: [
    o({ provider: "Televisa (Canal 5 / Las Estrellas)", kind: "free", delivery: ["tv"], note: "Spanish; free-to-air share of matches", source: "https://es.wikipedia.org/wiki/Anexo:Derechos_de_transmisi%C3%B3n_de_la_Copa_Mundial_de_F%C3%BAtbol_de_2026" }),
    o({ provider: "TV Azteca (Azteca 7)", kind: "free", delivery: ["tv", "stream"], note: "Spanish; free-to-air subset", source: "https://www.olympics.com/es/noticias/mundial-2026-mexico-partidos-tele-abierta" }),
    o({ provider: "ViX", kind: "paid", delivery: ["stream"], price: { amount: 799, currency: "MXN", period: "tournament" }, note: "Spanish; only outlet with all 104 — one-time 'Pase Mundial' add-on", source: "https://www.dazn.com/es-MX/news/f%C3%BAtbol/como-ver-mundial-2026-mexico-vivo-tv-abierta-streaming/1cdsg8vc91zvu1rrncnkjq2k2y" }),
  ],
  BR: [
    o({ provider: "TV Globo", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; ~54 matches incl. all Brazil games & the final; streams on Globoplay", source: "https://pt.wikipedia.org/wiki/Lista_de_transmissoras_da_Copa_do_Mundo_FIFA_de_2026" }),
    o({ provider: "CazéTV", kind: "free", delivery: ["stream"], note: "Free on YouTube; only outlet with all 104 matches", source: "https://www.lance.com.br/fora-de-campo/copa-do-mundo-saiba-tudo-sobre-a-transmissao-da-cazetv.html" }),
    o({ provider: "SBT", kind: "free", delivery: ["tv"], note: "Free-to-air; 32-match package", source: "https://www.lance.com.br/lancepedia/transmissao-tv-copa-do-mundo-2026.html" }),
    o({ provider: "SporTV", kind: "paid", delivery: ["tv", "stream"], note: "Pay-TV (Globo group); subset of matches, also on Globoplay", source: "https://www.goal.com/br/not%C3%ADcias/onde-assistir-jogos-copa-mundo-2026-streaming-tv-youtube-apps-guia-completo-transmissao/blta75c9eba73a305ad" }),
  ],
  FR: [
    o({ provider: "M6", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; 54 matches, also free on M6+ (TF1 lost the rights for 2026)", source: "https://www.mycomm.fr/blog/chaines-diffusion-coupe-du-monde-2026" }),
    o({ provider: "beIN Sports", kind: "paid", delivery: ["tv", "stream"], note: "Subscription; all 104 matches, ~50 exclusive", source: "https://www.eurosport.fr/football/coupe-du-monde/2026/horaires-diffusion-chaines-streaming-le-programme-tv-de-la-coupe-du-monde-2026-de-football-avec-tous-les-matches_sto23305744/story.shtml" }),
  ],
  DE: [
    o({ provider: "ARD", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air public broadcaster; ~30 matches incl. Germany games, semis & final", source: "https://www.broadbandtvnews.com/2025/10/07/deutsche-telekom-secures-tv-rights-to-football-world-cup-2026-and-euro-2028/" }),
    o({ provider: "ZDF", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air public broadcaster; ~30 matches", source: "https://www.broadbandtvnews.com/2025/10/07/deutsche-telekom-secures-tv-rights-to-football-world-cup-2026-and-euro-2028/" }),
    o({ provider: "MagentaTV", kind: "paid", delivery: ["tv", "stream"], note: "Deutsche Telekom; all 104 matches, 44 exclusive (incl. all round-of-32)", source: "https://www.insideworldfootball.com/2025/10/08/deutsche-telekoms-magentatv-swoops-2026-rights-cuts-deal-ard-zdf/" }),
  ],
  ES: [
    o({ provider: "RTVE", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; one match/day incl. all Spain games, opener, both semis & final; RTVE Play", source: "https://www.sportcal.com/media/dazn-to-show-world-cup-in-spain-through-mediapro-distribution-deal/" }),
    o({ provider: "DAZN", kind: "paid", delivery: ["stream"], note: "All 104 matches via Mediapro ('Gol Mundial'), also on Movistar Plus+", source: "https://www.sportcal.com/media/dazn-to-show-world-cup-in-spain-through-mediapro-distribution-deal/" }),
  ],
  PT: [
    o({ provider: "RTP", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; part of a 20-match shared free package incl. the final; RTP Play", source: "https://www.publico.pt/2026/06/06/desporto/noticia/rtp-sic-tvi-chegam-acordo-fifa-vao-transmitir-20-jogos-mundial-2177358" }),
    o({ provider: "SIC", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; shares the 20-match free package", source: "https://www.dn.pt/desporto/mundial-2026-rtp-sic-e-tvi-garantem-transmisso-em-sinal-aberto-dos-jogos-de-portugal" }),
    o({ provider: "TVI", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; opens the tournament; shares the 20-match package", source: "https://www.record.pt/internacional/competicoes-de-selecoes/mundial/mundial-2026/detalhe/mundial-2026-vai-dar-em-sinal-aberto-fifa-chega-a-acordo-com-rtp-sic-e-tvi" }),
    o({ provider: "LiveModeTV", kind: "free", delivery: ["stream"], note: "Free on YouTube; 34 matches", source: "https://www.record.pt/casas-de-apostas/mundial-2026/onde-ver-mundial-2026/" }),
    o({ provider: "Sport TV", kind: "paid", delivery: ["tv", "stream"], note: "Pay-TV; all 104 matches", source: "https://www.record.pt/casas-de-apostas/mundial-2026/onde-ver-mundial-2026/" }),
  ],
  PL: [
    o({ provider: "TVP", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; all 104 matches free on TVP1/2, TVP Sport & the TVP Sport app", source: "https://centruminformacji.tvp.pl/93713036/fifa-world-cup-2026-transmisje-wszystkich-meczow-mundialu-w-telewizji-polskiej" }),
  ],
  JP: [
    o({ provider: "NHK", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; all Japan matches plus key games; streams on NHK+", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
    o({ provider: "Nippon TV", kind: "free", delivery: ["tv"], note: "Free-to-air; select package of matches", source: "https://www.goal.com/en/news/japan-football-tv-schedule/blt19257e33f4c4e273" }),
    o({ provider: "Fuji TV", kind: "free", delivery: ["tv"], note: "Free-to-air; select package incl. start of the knockout rounds", source: "https://www.goal.com/en/news/japan-football-tv-schedule/blt19257e33f4c4e273" }),
    o({ provider: "ABEMA", kind: "free", delivery: ["stream"], confidence: "unknown", note: "Reported free live streaming — not strongly cross-confirmed", source: "https://www.goal.com/en/news/japan-football-tv-schedule/blt19257e33f4c4e273" }),
    o({ provider: "DAZN", kind: "paid", delivery: ["stream"], note: "Pay streaming; all 104 matches (new for 2026)", source: "https://www.sportsvideo.org/2026/06/11/dazn-announces-in-app-features-for-fifa-world-cup-2026-coverage-in-spain-italy-and-japan/" }),
  ],

  // ── Rest of Europe (EU) ───────────────────────────────────────────────────
  IT: [
    o({ provider: "RAI", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; 35 selected matches incl. opener, both semis & final; RaiPlay", source: "https://en.ilsole24ore.com/art/to-rai-free-to-air-football-world-cup-2026-broadcasting-rights-AId1GaeB" }),
    o({ provider: "DAZN", kind: "paid", delivery: ["stream"], price: { amount: 11.99, currency: "EUR", period: "month" }, note: "Full live package — all 104 matches (69 exclusive); 'Start' tier shown", source: "https://dazngroup.com/press-room/in-italy-dazn-will-be-the-only-place-to-watch-the-entire-fifa-world-cup-2026/" }),
  ],
  NL: [
    o({ provider: "NOS (NPO)", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; all 104 matches free-to-air on NPO 1 + NPO Start", source: "https://www.goal.com/en/news/watch-live-stream-fifa-world-cup-2026-nos-nederland/bltf3ac51efc9e598dc" }),
  ],
  BE: [
    o({ provider: "VRT (Sporza)", kind: "free", delivery: ["tv", "stream"], note: "Dutch-language public broadcaster; free on VRT 1/Canvas + VRT MAX", source: "https://www.goal.com/en/news/watch-live-stream-belgium-football/blt26f3373e2fbbd352" }),
    o({ provider: "RTBF (Auvio)", kind: "free", delivery: ["tv", "stream"], note: "French-language public broadcaster; free on RTBF Auvio", source: "https://www.goal.com/en/news/watch-live-stream-belgium-football/blt26f3373e2fbbd352" }),
  ],
  IE: [
    o({ provider: "RTÉ", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; all 104 matches free on RTÉ + RTÉ Player (a 'listed event')", source: "https://www.irishtimes.com/business/2026/06/09/the-world-cup-is-still-free-to-watch-in-ireland-but-for-how-much-longer/" }),
  ],
  AT: [
    o({ provider: "ORF", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; 52 matches incl. exclusive opener & final; ORF ON", source: "https://www.horizont.at/medien/news/tv-rechte-magenta-tv-uebertraegt-alle-wm-spiele-101438" }),
    o({ provider: "ServusTV", kind: "free", delivery: ["tv", "stream"], note: "Red Bull-owned free-to-air; 52 matches; ServusTV On", source: "https://www.horizont.at/medien/news/tv-rechte-magenta-tv-uebertraegt-alle-wm-spiele-101438" }),
    o({ provider: "Magenta TV WM-Spezial", kind: "paid", delivery: ["tv", "stream"], price: { amount: 19.9, currency: "EUR", period: "tournament" }, note: "One-off pass; all 104 matches + 3 WM channels; no Magenta contract needed", source: "https://newsroom.magenta.at/2026/05/19/magenta-tv-offnet-wm-angebot-fur-ganz-osterreich/" }),
  ],
  GR: [
    o({ provider: "ERT", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; exclusive, all 104 matches on ERT + ERTFLIX", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
  ],
  HR: [
    o({ provider: "HRT", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; exclusive, all 104 matches on HRT2 + HRTi", source: "https://www.livesoccertv.com/competitions/international/world-cup/watch/croatia/" }),
  ],
  SE: [
    o({ provider: "SVT", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; ~23 group matches + Sweden games, free on SVT Play", source: "https://inside.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/media-releases/fifa-world-cup-2026-media-rights-awarded-in-the-nordic-territories" }),
    o({ provider: "TV4", kind: "free", delivery: ["tv", "stream"], note: "Commercial free-to-air; ~49 group matches + the final; no paid tier needed", source: "https://worldcuppass.com/how-to-watch-world-cup-2026-in-sweden/" }),
  ],
  DK: [
    o({ provider: "DR", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; free on DR + DRTV", source: "https://inside.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/media-releases/fifa-world-cup-2026-media-rights-awarded-in-the-nordic-territories" }),
    o({ provider: "TV2", kind: "free", delivery: ["tv", "stream"], note: "Commercial; main-channel matches free-to-air (some on-demand behind TV2 Play)", source: "https://inside.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/media-releases/fifa-world-cup-2026-media-rights-awarded-in-the-nordic-territories" }),
  ],
  FI: [
    o({ provider: "Yle", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; free on Yle TV + Yle Areena", source: "https://inside.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/media-releases/fifa-world-cup-2026-media-rights-awarded-in-the-nordic-territories" }),
    o({ provider: "MTV", kind: "paid", delivery: ["tv", "stream"], confidence: "unknown", note: "Co-rights-holder; live coverage reported subscription-based via MTV Katsomo+ — 2026 terms unconfirmed", source: "https://fwctimes.com/finland-football-tv-schedule/" }),
  ],

  // ── Non-EU Europe ─────────────────────────────────────────────────────────
  CH: [
    o({ provider: "SRG SSR (SRF / RTS / RSI)", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; all matches free in DE/FR/IT, via Play SRF/RTS/RSI", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
  ],
  NO: [
    o({ provider: "NRK", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; 51 matches incl. final & key Norway games; NRK TV", source: "https://inside.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/media-releases/fifa-world-cup-2026-media-rights-awarded-in-the-nordic-territories" }),
    o({ provider: "TV 2 (TV 2 Play)", kind: "paid", delivery: ["tv", "stream"], note: "Shares matches with NRK; streaming via TV 2 Play subscription", source: "https://inside.fifa.com/tournaments/mens/worldcup/canadamexicousa2026/media-releases/fifa-world-cup-2026-media-rights-awarded-in-the-nordic-territories" }),
  ],
  TR: [
    o({ provider: "TRT (TRT 1 / TRT Spor)", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; all 104 matches free, streaming via Tabii", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
  ],

  // ── Americas ──────────────────────────────────────────────────────────────
  AR: [
    o({ provider: "Telefe", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; ~32 matches incl. Argentina games; Mi Telefe", source: "https://www.ambito.com/deportes/donde-ver-los-104-partidos-del-mundial-y-que-canales-transmiten-los-partidos-argentina" }),
    o({ provider: "TV Pública", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; ~10 matches", source: "https://www.ambito.com/deportes/donde-ver-los-104-partidos-del-mundial-y-que-canales-transmiten-los-partidos-argentina" }),
    o({ provider: "TyC Sports", kind: "paid", delivery: ["tv", "stream"], note: "Pay/cable; ~52 matches incl. all Argentina games & final; TyC Sports Play", source: "https://www.ambito.com/deportes/donde-ver-los-104-partidos-del-mundial-y-que-canales-transmiten-los-partidos-argentina" }),
    o({ provider: "DSports (DirecTV / DGO)", kind: "paid", delivery: ["tv", "stream"], note: "Only signal with all 104 matches; DirecTV + DGO streaming", source: "https://www.ambito.com/deportes/donde-ver-los-104-partidos-del-mundial-y-que-canales-transmiten-los-partidos-argentina" }),
  ],
  UY: [
    o({ provider: "Canal 5 (TNU)", kind: "free", delivery: ["tv"], note: "Public free-to-air; 32 matches incl. Uruguay games, opener & final", source: "https://www.apu.uy/noticias/comienza-el-mundial-canal-5-y-antel-tv-transmitiran-32-partidos-de-forma-gratuita" }),
    o({ provider: "Antel TV", kind: "free", delivery: ["stream"], note: "State telecom streaming; same 32 free matches, no data charge for Antel users", source: "https://www.apu.uy/noticias/comienza-el-mundial-canal-5-y-antel-tv-transmitiran-32-partidos-de-forma-gratuita" }),
    o({ provider: "DSports (DirecTV / DGO)", kind: "paid", delivery: ["tv", "stream"], note: "Pay; all 104 matches via DirecTV, DGO & Paramount+", source: "https://www.elobservador.com.uy/cultura-y-espectaculos/donde-se-podra-ver-el-mundial-2026-television-y-streaming-una-guia-las-opciones-disponibles-y-cuantos-partidos-tiene-cada-una-n6038933" }),
  ],
  CO: [
    o({ provider: "Caracol Televisión", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; 35 matches incl. Colombia; Caracol Play / Ditu", source: "https://www.semana.com/deportes/articulo/directv-win-rcn-y-caracol-television-se-repartieron-los-partidos-del-mundial-2026-asi-quedo-la-tabla-completa/202613/" }),
    o({ provider: "Canal RCN", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; 35 matches incl. Colombia; RCN Total", source: "https://www.semana.com/deportes/articulo/directv-win-rcn-y-caracol-television-se-repartieron-los-partidos-del-mundial-2026-asi-quedo-la-tabla-completa/202613/" }),
    o({ provider: "Win Sports", kind: "paid", delivery: ["tv", "stream"], note: "Pay; 25 matches; Win Play", source: "https://www.semana.com/deportes/articulo/directv-win-rcn-y-caracol-television-se-repartieron-los-partidos-del-mundial-2026-asi-quedo-la-tabla-completa/202613/" }),
    o({ provider: "DSports (DirecTV / DGO)", kind: "paid", delivery: ["tv", "stream"], note: "Pay; all 104 matches via DirecTV & DGO", source: "https://www.eltiempo.com/deportes/futbol-internacional/canales-y-paginas-web-que-transmitiran-los-partidos-del-mundial-2026-en-colombia-3563281" }),
  ],
  CL: [
    o({ provider: "Chilevisión", kind: "free", delivery: ["tv", "stream"], note: "Free-to-air; 52 of 104 matches; Chilevisión / Pluto TV", source: "https://es.wikipedia.org/wiki/Anexo:Derechos_de_transmisi%C3%B3n_de_la_Copa_Mundial_de_F%C3%BAtbol_de_2026" }),
    o({ provider: "DSports (DirecTV / DGO)", kind: "paid", delivery: ["tv", "stream"], price: { amount: 7200, currency: "CLP", period: "month" }, note: "Pay; all 104 matches; DGO cheapest plan ~CLP 7,200/mo", source: "https://bolavip.com/cl/mundial/en-vivo-por-tv-y-streaming-las-3-formas-de-ver-todos-los-partidos-del-mundial-2026-en-chile" }),
  ],

  // ── Asia-Pacific ──────────────────────────────────────────────────────────
  AU: [
    o({ provider: "SBS", kind: "free", delivery: ["tv", "stream"], note: "All 104 matches live & free on SBS, SBS VICELAND & SBS On Demand", source: "https://www.sbs.com.au/sport/fifa-world-cup-2026/how-to-watch" }),
  ],
  KR: [
    o({ provider: "KBS", kind: "free", delivery: ["tv"], note: "Free terrestrial (KBS2), sub-licensed; Korea's group games & the final", source: "https://en.sedaily.com/sports/2026/04/20/kbs-jtbc-strike-deal-to-jointly-broadcast-2026-world-cup" }),
    o({ provider: "JTBC", kind: "paid", delivery: ["tv"], note: "Primary rights holder; pay channels JTBC, JTBC2/4, Golf&Sports", source: "https://www.koreatimes.co.kr/sports/20260422/world-cup-broadcast-deal-limits-viewing-to-jtbc-kbs-as-talks-collapse-with-mbc-sbs" }),
    o({ provider: "Naver Sports / CHZZK", kind: "free", delivery: ["stream"], confidence: "unknown", note: "Digital streaming sub-licensed from JTBC (per Wikipedia; not press-confirmed)", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
  ],
  IN: [
    o({ provider: "Unite8 Sports (Zee)", kind: "paid", delivery: ["tv"], note: "Zee's dedicated TV channels; full coverage (Doordarshan free only for 8 knockout matches)", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
    o({ provider: "ZEE5", kind: "paid", delivery: ["stream"], price: { amount: 799, currency: "INR", period: "tournament" }, note: "Full tournament; ₹799/3 months (ads) or ₹1,699/yr (ad-free)", source: "https://www.business-standard.com/sports/fifa-world-cup/rs-799-to-watch-fifa-world-cup-on-zee5-five-things-fans-must-know-126061100721_1.html" }),
  ],
  CN: [
    o({ provider: "CMG / CCTV", kind: "free", delivery: ["tv", "stream"], note: "Exclusive holder; all 104 matches free on CCTV-5 / CCTV-5+", source: "https://www.sportspro.com/news/broadcast-ott/fifa-world-cup-2026-china-cmg-cctv-rights-deal-may-2026/" }),
    o({ provider: "Xiaohongshu / RedNote", kind: "free", delivery: ["stream"], note: "Free streaming of all 104 matches + replays/highlights", source: "https://www.yicaiglobal.com/news/xiaohongshu-secures-2026-fifa-world-cup-broadcasting-rights-from-china-state-media" }),
    o({ provider: "Migu Video", kind: "paid", delivery: ["stream"], note: "China Mobile platform; sub-licensed paid streaming", source: "https://worldcuppass.com/2026-fifa-world-cup-tv-coverage/" }),
  ],

  // ── Africa & Middle East ──────────────────────────────────────────────────
  MA: [
    o({ provider: "SNRT (Al Aoula / Arryadia)", kind: "free", delivery: ["tv", "stream"], note: "National public broadcaster (sub-licensed from beIN); all Morocco games free", source: "https://www.moroccoworldnews.com/2026/06/313289/world-cup-2026-national-tv-secures-broadcasting-rights-for-moroccos-games/" }),
    o({ provider: "beIN Sports", kind: "paid", delivery: ["tv", "stream"], note: "Exclusive MENA pay rights, all 104 matches (satellite, beIN Connect, TOD)", source: "https://www.thenationalnews.com/arts-culture/film-tv/2026/06/11/fifa-world-cup-2026-how-to-watch-uae-tv-streaming-channels/" }),
  ],
  ZA: [
    o({ provider: "SABC", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; ~35 matches free incl. all Bafana games, knockouts & final; SABC+", source: "https://www.ewn.co.za/2026/06/09/sabc-to-air-35-fifa-world-cup-matches-for-free-as-dstv-launches-r99-package" }),
    o({ provider: "SuperSport (DStv)", kind: "paid", delivery: ["tv", "stream"], price: { amount: 99, currency: "ZAR", period: "month" }, note: "All 104 matches on every DStv tier; R99/mo entry package", source: "https://bandwidthblog.co.za/2026/04/18/supersport-fifa-world-cup-2026-south-africa/" }),
    o({ provider: "SportyTV", kind: "paid", delivery: ["stream", "tv"], note: "Exclusive streaming rights to all 104 matches; on the DStv app", source: "https://news.broadcastmediaafrica.com/2026/04/14/south-africa-sportytv-secures-exclusive-streaming-rights-for-fifa-world-cup-2026/" }),
  ],
  SA: [
    o({ provider: "SSC (Saudi Sports Company)", kind: "free", delivery: ["tv", "stream"], confidence: "unknown", note: "State channel reported to take an FTA package (Saudi games, opener, final) — 2026 deal not officially confirmed", source: "https://www.khaspress.com/2026/06/fifa-world-cup-2026-broadcast-rights-watch-live-saudi-arabia/" }),
    o({ provider: "beIN Sports", kind: "paid", delivery: ["tv", "stream"], price: { amount: 159.99, currency: "USD", period: "tournament" }, note: "Exclusive MENA rights, all 104 matches; TOD Full Pass ~$159.99 (SAR not published)", source: "https://www.thenationalnews.com/arts-culture/film-tv/2026/06/11/fifa-world-cup-2026-how-to-watch-uae-tv-streaming-channels/" }),
  ],
  NG: [
    o({ provider: "NTA", kind: "free", delivery: ["tv"], note: "Free-to-air; selected marquee matches — opener, Africa/Nigeria fixtures, semis & final", source: "https://www.khaspress.com/2026/05/fifa-world-cup-2026-nigeria-broadcast-rights-how-to-watch/" }),
    o({ provider: "SuperSport (DStv/GOtv/Showmax)", kind: "paid", delivery: ["tv", "stream"], note: "Primary sub-Saharan rights; all 104 on DStv, GOtv Select & Showmax", source: "https://www.khaspress.com/2026/05/fifa-world-cup-2026-nigeria-broadcast-rights-how-to-watch/" }),
    o({ provider: "StarTimes / SportyTV", kind: "paid", delivery: ["tv", "stream"], confidence: "unknown", note: "Listed on Wikipedia for Nigeria; not corroborated by local trade press", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
  ],

  // ── More Europe ───────────────────────────────────────────────────────────
  RO: [
    o({ provider: "Antena 1", kind: "free", delivery: ["tv"], note: "Free-to-air commercial channel; all 104 matches (parallel ties on Antena 3 CNN)", source: "https://antenagroup.ro/ro/stiri/antena-e-fifa-world-cup-in-romania.html" }),
    o({ provider: "AntenaPLAY", kind: "paid", delivery: ["stream"], price: { amount: 30, currency: "RON", period: "month" }, confidence: "unknown", note: "Streams all 104 matches; approx subscription, not a WC-specific pass", source: "https://www.onlinesport.ro/fotbal/cupa-mondiala-de-fotbal/cm-2026/program-si-cine-transmite-cupa-mondiala-de-fotbal-din-2026-in-romania/" }),
  ],
  CZ: [
    o({ provider: "Česká televize (ČT)", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster (EBU); free-to-air + ČT iVysílání", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
    o({ provider: "TV Nova", kind: "free", delivery: ["tv", "stream"], note: "Commercial free-to-air co-broadcaster; also on Voyo", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
  ],
  HU: [
    o({ provider: "M4 Sport (MTVA)", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; all matches free on M4 Sport + Mediaklikk", source: "https://hvg.hu/sport/20241028_mtva-kozmedia-foci-vb-kozvetites" }),
  ],
  RS: [
    o({ provider: "RTS", kind: "free", delivery: ["tv", "stream"], note: "Public free-to-air; 52 of 104 matches (group + all knockouts) on RTS 1/2/3", source: "https://mondo.rs/sport/fudbal/fifa-wc-2026/a2239116/ko-prenosi-svetsko-prvenstvo-2026.html" }),
    o({ provider: "Arena Sport", kind: "paid", delivery: ["tv", "stream"], note: "Telekom Srbija; exclusive pay holder of all 104 matches", source: "https://direktno.rs/sport/fudbal/695629/svetsko-prvenstvo-tv-prenos-rts-arena-sport.html" }),
  ],
  UA: [
    o({ provider: "MEGOGO Sport (free)", kind: "free", delivery: ["tv"], note: "Selected free matches on T2 digital TV — one/day, opener, 2 QF, both SF, 3rd-place, final", source: "https://champion.com.ua/ukr/football/de-divitisya-chs-2026-z-futbolu-bezplatni-translyaciji-matchiv-na-megogo-1076002/" }),
    o({ provider: "MEGOGO", kind: "paid", delivery: ["stream", "tv"], note: "Exclusive rights holder; all 104 matches via MEGOGO Sport subscription", source: "https://sport.nv.ua/ukr/chm-2026/chs-2026-hto-v-ukrajini-bude-translyuvati-chempionat-svitu-futbol-pokazhe-megogo-50615269.html" }),
  ],

  // ── More Middle East ──────────────────────────────────────────────────────
  AE: [
    o({ provider: "TOD", kind: "paid", delivery: ["stream"], price: { amount: 586, currency: "AED", period: "tournament" }, note: "beIN's OTT; all 104 matches in 4K — TOD Full Pass (~US$159.99)", source: "https://www.thenationalnews.com/arts-culture/film-tv/2026/06/11/fifa-world-cup-2026-how-to-watch-uae-tv-streaming-channels/" }),
    o({ provider: "beIN Sports", kind: "paid", delivery: ["tv", "stream"], note: "Exclusive MENA pay rights to all 104 matches (satellite, beIN Connect)", source: "https://www.thenationalnews.com/arts-culture/film-tv/2026/06/11/fifa-world-cup-2026-how-to-watch-uae-tv-streaming-channels/" }),
  ],
  EG: [
    o({ provider: "beIN Sports", kind: "paid", delivery: ["tv", "stream"], note: "Exclusive MENA pay rights to all 104 matches (satellite, beIN Connect, TOD)", source: "https://www.thenationalnews.com/arts-culture/film-tv/2026/06/11/fifa-world-cup-2026-how-to-watch-uae-tv-streaming-channels/" }),
    o({ provider: "TOD", kind: "paid", delivery: ["stream"], note: "beIN's OTT; all 104 matches (Talabat Pro + TOD bundle ~EGP 1,300/yr)", source: "https://www.thenationalnews.com/arts-culture/film-tv/2026/06/11/fifa-world-cup-2026-how-to-watch-uae-tv-streaming-channels/" }),
  ],
  IL: [
    o({ provider: "KAN (Kan 11)", kind: "free", delivery: ["tv", "stream"], note: "Israeli public broadcaster; free-to-air via EBU deal (separate from MENA/beIN)", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
    o({ provider: "Charlton", kind: "paid", delivery: ["tv", "stream"], confidence: "unknown", note: "Local rights-holder; complementary/pay coverage — split not fully confirmed", source: "https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_broadcasting_rights" }),
  ],

  // ── More Asia & Oceania ───────────────────────────────────────────────────
  ID: [
    o({ provider: "TVRI", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; all 104 matches free on DTT + tvri.go.id", source: "https://inside.fifa.com/news/successful-fifa-world-cup-2026-media-rights-sales-asia" }),
    o({ provider: "FolaPlay", kind: "free", delivery: ["stream"], note: "Official TVRI OTT partner; live, replay & highlights", source: "https://www.cnnindonesia.com/teknologi/20260610101030-185-1367398/daftar-aplikasi-nonton-streaming-piala-dunia-2026-resmi-dan-legal" }),
    o({ provider: "MAXstream (Telkomsel)", kind: "paid", delivery: ["stream"], price: { amount: 25000, currency: "IDR", period: "tournament" }, note: "Official OTT; 'Bola Gembira' passes from Rp25,000 (7-day); needs an active Telkomsel number", source: "https://www.cnbcindonesia.com/tech/20260611082553-37-741875/cara-nonton-streaming-piala-dunia-2026-pakai-folaplay-dan-maxstream" }),
  ],
  TH: [
    o({ provider: "Jasmine / MONOMAX", kind: "unknown", delivery: ["tv", "stream"], confidence: "unknown", note: "JAS signed a last-minute deal (11 Jun 2026); free-to-air vs pay/streaming mix not yet finalized", source: "https://en.vietnamplus.vn/thai-broadcaster-secures-fifa-world-cup-2026-rights-at-last-minute-post344438.vnp" }),
  ],
  VN: [
    o({ provider: "VTV", kind: "free", delivery: ["tv", "stream"], note: "Exclusive national rights; all 104 matches free on VTV3/6/10 + VTV digital", source: "https://english.vov.vn/en/sports/vtv-secures-exclusive-broadcast-rights-for-fifa-world-cup-2026-in-vietnam-post1283702.vov" }),
  ],
  PH: [
    o({ provider: "Aleph Arena (YouTube)", kind: "free", delivery: ["stream"], note: "~40 marquee matches free on YouTube with Filipino commentary", source: "https://www.prnewswire.com/apac/news-releases/aleph-launches-first-of-its-kind-multichannel-distribution-model-to-redefine-the-fifa-world-cup-2026-fan-experience-in-the-philippines-302796532.html" }),
    o({ provider: "BlastTV", kind: "paid", delivery: ["stream"], price: { amount: 1999, currency: "PHP", period: "tournament" }, note: "Premium PPV pass for all 104 matches via app.blasttv.ph", source: "https://techpilipinas.com/how-to-watch-fifa-world-cup-2026-philippines/" }),
    o({ provider: "TAP DMV (Cignal/TapGO)", kind: "paid", delivery: ["tv", "stream"], note: "TAP-distributed World Cup channels via Cignal Play and TapGO", source: "https://www.philstar.com/sports/2026/05/30/2531641/fifa-world-cup-headed-philippine-screens-after-aleph-tap-dmv-deal" }),
  ],
  MY: [
    o({ provider: "RTM", kind: "free", delivery: ["tv", "stream"], note: "Public broadcaster; free-to-air majority of matches; free on RTMKlik", source: "https://www.malaymail.com/news/malaysia/2026/06/07/how-malaysians-can-watch-the-fifa-world-cup-2026-a-complete-guide/221841" }),
    o({ provider: "Unifi TV", kind: "paid", delivery: ["tv", "stream"], price: { amount: 50, currency: "MYR", period: "tournament" }, note: "All 104 matches; season pass RM50 (subscribers), RM20 daily option", source: "https://www.thestar.com.my/lifestyle/entertainment/2026/06/09/unifi-tv-to-broadcast-all-104-fifa-world-cup-2026-matches-live" }),
  ],
  SG: [
    o({ provider: "Mediacorp (Channel 5 / mewatch)", kind: "free", delivery: ["tv", "stream"], note: "28 matches free on Channel 5 + mewatch (opener, group games, SFs, finals)", source: "https://www.businesstoday.com.my/2026/04/02/mediacorp-offering-singaporeans-all-104-world-cup-matches-live-from-s98/" }),
    o({ provider: "mewatch All-Access", kind: "paid", delivery: ["stream", "tv"], price: { amount: 118, currency: "SGD", period: "tournament" }, note: "All 104 matches on mewatch; also via Singtel & StarHub TV+", source: "https://www.businesstoday.com.my/2026/04/02/mediacorp-offering-singaporeans-all-104-world-cup-matches-live-from-s98/" }),
  ],
  HK: [
    o({ provider: "ViuTV", kind: "free", delivery: ["tv", "stream"], note: "PCCW; 25 matches free incl. opener, SFs & final (Cantonese)", source: "https://www.pccw.com/assets/Common/files/press-release/2026/Feb/Press%20release_Now%20TV%20and%20ViuTV%20to%20exclusively%20broadcast%20the%20FIFA%20World%20Cup%202026%E2%84%A2%20in%20Hong%20Kong_EN.pdf" }),
    o({ provider: "Now TV", kind: "paid", delivery: ["tv", "stream"], price: { amount: 380, currency: "HKD", period: "tournament" }, note: "PCCW; all 104 matches in 4K — Event Pass HK$380", source: "https://www.pccw.com/assets/Common/files/press-release/2026/May/Press%20release_Now%20TV%20x%20ViuTV%20bring%20FIFA%20World%20Cup%202026%E2%84%A2%20mania%20to%20Hong%20Kong_EN.pdf" }),
  ],
  NZ: [
    o({ provider: "TVNZ", kind: "free", delivery: ["tv", "stream"], note: "22 matches free incl. all NZ games, opener, R16, QF, SF & final on TVNZ 1 / TVNZ+", source: "https://www.1news.co.nz/2026/05/04/defining-moment-tvnz-reveals-fifa-world-cup-event-pass-pricing/" }),
    o({ provider: "TVNZ+ Event Pass", kind: "paid", delivery: ["stream"], price: { amount: 44.95, currency: "NZD", period: "tournament" }, note: "All 104 matches + daily highlights — one-off NZ$44.95 pass", source: "https://www.1news.co.nz/2026/05/04/defining-moment-tvnz-reveals-fifa-world-cup-event-pass-pricing/" }),
  ],
};

// Country-level committed rights, exported for the refresh pipeline's differ.
export const COUNTRY_RIGHTS = BASE;
export const VERIFIED_AT = VERIFIED;

function buildRights(): RightsTable {
  const table: RightsTable = {};
  for (const country of Object.keys(BASE)) {
    table[country] = {};
    for (const match of MATCHES) {
      table[country][match.id] = BASE[country];
    }
  }
  return table;
}

export const RIGHTS: RightsTable = buildRights();
