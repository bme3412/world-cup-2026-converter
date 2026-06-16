import type { Metadata, Viewport } from "next";
import { Anton, IBM_Plex_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F6FC",
};

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "Far Post — where to watch the 2026 World Cup",
  description:
    "A live departures board for the World Cup: every match in your local time with the cheapest legal way to watch it from where you are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${plexMono.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
