import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Bright matchday — whitish paper, blueberry-blue accent.
        bg: "#F4F6FC", // whiteish page
        panel: "#FFFFFF", // cards
        raised: "#FBFCFE", // controls
        wash: "#E6EDFE", // light royal-blue accent layer
        ink: "#16203B", // deep navy text
        muted: "#69728F",
        line: "#E0E6F4",
        berry: "#1E50E8", // vibrant royal blue accent
        free: "#11875A", // free-to-air (readable on white)
        paid: "#CD3A24", // paid (readable on white)
        gold: "#A9772A", // caution / "home service blocked" pill
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        body: ["var(--font-hanken)", "system-ui", "sans-serif"],
      },
      keyframes: {
        flapIn: {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        flapIn: "flapIn 0.4s ease both",
        glowPulse: "glowPulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
