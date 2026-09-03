import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      colors: {
        brand: {
          950: "#000000",
          900: "#050507",
          850: "#09090C",
          800: "#0E0E12",
          750: "#141418",
          700: "#1B1B20",
          600: "#27272A",
          500: "#3F3F46",
          400: "#71717A",
          300: "#A1A1AA",
          200: "#D4D4D8",
          100: "#F4F4F5",
          50: "#FAFAFA",
          white: "#FFFFFF",
        },
        trade: {
          green: "#22C55E",
          red: "#EF4444",
        },
      },
      backgroundImage: {
        "black-gradient": "linear-gradient(180deg, #050507 0%, #000000 100%)",
        "mesh-radial-mono": "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 60%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "card-highlight": "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      boxShadow: {
        "glass-sm": "0 4px 20px 0 rgba(0, 0, 0, 0.4)",
        "glass-md": "0 8px 32px 0 rgba(0, 0, 0, 0.6)",
        "glass-lg": "0 12px 40px 0 rgba(0, 0, 0, 0.8)",
        "glow-white": "0 0 35px -5px rgba(255, 255, 255, 0.25)",
        "glow-white-sm": "0 0 15px 0 rgba(255, 255, 255, 0.15)",
        "glow-green": "0 0 25px -5px rgba(34, 197, 94, 0.35)",
        "glow-red": "0 0 25px -5px rgba(239, 68, 68, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-drift": "floatDrift 8s ease-in-out infinite alternate",
      },
      keyframes: {
        floatDrift: {
          "0%": { transform: "translate(0px, 0px) rotate(0deg)" },
          "50%": { transform: "translate(6px, -10px) rotate(0.5deg)" },
          "100%": { transform: "translate(-6px, 6px) rotate(-0.5deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
