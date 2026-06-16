import type { Confidence, Price, RightsTable, WatchOption } from "@/lib/types";
import { MATCHES } from "@/lib/data/matches";

// ─────────────────────────────────────────────────────────────────────────────
// REAL 2026 World Cup broadcast rights, country-level (applied to every match).
// Researched 2026-06-15 from the Wikipedia "2026 FIFA World Cup broadcasting
// rights" page, FIFA media-rights releases, and broadcaster announcements; each
// option carries its sourceUrl. This is the seed the refresh pipeline maintains.
//
// Country-level is deliberate: most WC rights are tournament-wide per market.
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
};

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
