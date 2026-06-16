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

const SITE = "https://beautifulgame2026.com";
const DESCRIPTION =
  "Every match of the 2026 tournament in your local time, with the cheapest legal way to watch it — free-to-air, streaming and TV channels by country.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "beautifulgame2026 — where to watch every match",
    template: "%s · beautifulgame2026",
  },
  description: DESCRIPTION,
  applicationName: "beautifulgame2026",
  keywords: [
    "where to watch",
    "TV channels",
    "live stream",
    "free to air",
    "2026 fixtures",
    "kickoff times",
    "football schedule",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "beautifulgame2026",
    url: SITE,
    title: "beautifulgame2026 — where to watch every match",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "beautifulgame2026 — where to watch every match",
    description: DESCRIPTION,
  },
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
