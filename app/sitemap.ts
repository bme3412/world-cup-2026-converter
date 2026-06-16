import type { MetadataRoute } from "next";
import { MATCHES } from "@/lib/data/matches";

const SITE = "https://beautifulgame2026.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/match`, changeFrequency: "daily", priority: 0.8 },
    ...MATCHES.map((m) => ({
      url: `${SITE}/match/${m.id}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
