import { ImageResponse } from "next/og";

export const alt = "beautifulgame2026 — where to watch every match";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F4F6FC",
          backgroundImage: "radial-gradient(120% 90% at 50% -20%, rgba(30,80,232,0.14), transparent 55%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>
          <span style={{ color: "#16203B" }}>beautiful</span>
          <span style={{ color: "#1E50E8" }}>game2026</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 40, color: "#16203B", maxWidth: 900 }}>
          Where to watch every match — in your time, cheapest legal way first.
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 16, fontSize: 26, color: "#69728F" }}>
          <span>58 countries</span>
          <span>•</span>
          <span>free &amp; streaming options</span>
          <span>•</span>
          <span>kickoff in your timezone</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
