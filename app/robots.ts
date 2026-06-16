import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://beautifulgame2026.com/sitemap.xml",
    host: "https://beautifulgame2026.com",
  };
}
