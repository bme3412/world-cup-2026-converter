// Primary national colour per team, used for the diagonal accents behind the
// crest on each match card. Purely decorative.

const COLORS: Record<string, string> = {
  // Featured
  ARG: "#75AADB", BRA: "#009C3B", FRA: "#21346B", ENG: "#CE1124", ESP: "#C60B1E",
  POR: "#006600", GER: "#1A1A1A", NED: "#F36C21", USA: "#3C3B6E", MEX: "#006847",
  CAN: "#D52B1E", JPN: "#BC002D", MAR: "#C1272D", CRO: "#D01C1F", BEL: "#ED2939",
  URU: "#4E9CD3",
  // Opponents
  RSA: "#007A4D", KOR: "#0047A0", CZE: "#11457E", BIH: "#002395", SUI: "#D52B1E",
  QAT: "#8A1538", SCO: "#0065BD", HAI: "#00209F", PAR: "#D52B1E", AUS: "#00843D",
  TUR: "#E30A17", CUW: "#002B7F", CIV: "#FF8200", ECU: "#FFD100", SWE: "#006AA7",
  TUN: "#E70013", EGY: "#CE1126", IRN: "#239F40", NZL: "#00247D", CPV: "#003893",
  KSA: "#006C35", SEN: "#00853F", IRQ: "#007A3D", NOR: "#BA0C2F", ALG: "#006233",
  AUT: "#ED2939", JOR: "#007A3D", COD: "#007FFF", UZB: "#1EB53A", COL: "#FCD116",
  GHA: "#006B3F", PAN: "#DA121A",
};

export function teamColor(code: string): string {
  return COLORS[code] ?? "#64748B";
}
