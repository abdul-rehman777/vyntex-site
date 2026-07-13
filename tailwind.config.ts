import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * VYNTEX design system.
 * Approved palette (derived from the logo): near-black background, deep navy
 * panels, chrome silver, electric blue, cyan accents. No violet, no gold.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./context/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        vx: {
          bg: "#050714", // near-black deep space
          bg2: "#0A0D1F", // panel background
          bg3: "#0E1229", // elevated panel
          ink: "#E8EAFF", // primary text
          muted: "#7880A8", // secondary text
          blue: "#0EA5E9", // electric blue
          "blue-deep": "#0369A1", // deep blue
          silver: "#CBD5E1", // chrome silver
          "silver-dim": "#475569", // muted silver
          cyan: "#22D3EE", // accent cyan
          glow: "#38BDF8", // glow highlight
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        vx: "16px",
      },
      borderColor: {
        "vx-line": "rgba(14, 165, 233, 0.15)",
      },
      backgroundImage: {
        "vx-grad": "linear-gradient(135deg, #0EA5E9, #22D3EE, #CBD5E1)",
        "vx-grad-text": "linear-gradient(135deg, #38BDF8, #22D3EE, #E2E8F0)",
      },
      boxShadow: {
        "vx-glow": "0 0 30px rgba(14,165,233,0.20), 0 0 60px rgba(14,165,233,0.08)",
        "vx-glow-sm": "0 0 15px rgba(14,165,233,0.15)",
        "vx-nav": "0 4px 30px rgba(14,165,233,0.08)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0", transform: "scale(1.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 400ms ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        "draw-line": "drawLine 1.6s ease-out forwards",
      },
    },
  },
  plugins: [typography],
};

export default config;
