import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#111111",
          soft: "#1A1917",
          muted: "#262420",
        },
        gold: {
          light: "#E4C988",
          DEFAULT: "#D1AD61",
          dark: "#7A5F22", // AA-contrast gold for text on ivory
        },
        ivory: {
          light: "#FAF8F3",
          DEFAULT: "#F5F1E8",
          dark: "#E9E3D3",
          stone: "#DBD2BE",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond Variable"', "Georgia", "serif"],
        sans: ['"Inter Variable"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
