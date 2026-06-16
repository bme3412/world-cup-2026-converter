import type { Metadata, Viewport } from "next";
import { Anton, IBM_Plex_Mono, Hanken_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "beautifulgame2026 — where to watch every match",
  description:
    "Every match of the 2026 tournament in your local time, with the cheapest legal way to watch it from wherever you are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${plexMono.variable} ${hanken.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
