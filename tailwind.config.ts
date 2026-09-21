import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0A84FF",
          deepBlue: "#0066FF",
          violet: "#6D5DFB",
          deepViolet: "#7C3AED",
          cyan: "#00C2FF",
          emerald: "#22C55E",
          ink: "#0B1220",
          canvas: "#F7F9FC",
          obsidian: "#07111F",
          midnight: "#0B1627",
          slateDark: "#111C2E",
        },
        theme: {
          bg: "var(--bg-page)",
          surface: "var(--bg-surface)",
          "surface-muted": "var(--bg-surface-muted)",
          "surface-elevated": "var(--bg-surface-elevated)",
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          border: "var(--border-subtle)",
          "border-strong": "var(--border-strong)",
          accent: "var(--accent-primary)",
          "accent-hover": "var(--accent-hover)",
          "accent-subtle": "var(--accent-subtle)",
        },
        cyber: {
          bg: "var(--bg-page)",
          darker: "var(--bg-surface-muted)",
          card: "var(--bg-surface)",
          surface: "var(--bg-surface-elevated)",
          border: "var(--border-subtle)",
          borderCyan: "var(--accent-subtle)",
          cyan: "var(--accent-cyan)",
          blue: "var(--accent-primary)",
          violet: "var(--accent-violet)",
          glow: "rgba(10, 132, 255, 0.15)",
        },
      },
      backgroundImage: {
        "cyber-grid": "radial-gradient(circle at center, var(--radial-ambient) 0, transparent 70%), linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        "blue-glow": "0 0 25px -4px rgba(10, 132, 255, 0.35)",
        "blue-glow-lg": "0 0 45px -5px rgba(0, 102, 255, 0.45)",
        "violet-glow": "0 0 25px -4px rgba(109, 93, 251, 0.35)",
        "cyan-glow": "0 0 25px -4px rgba(0, 194, 255, 0.35)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "card-subtle": "0 10px 30px -10px rgba(11, 18, 32, 0.08)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 5.5s ease-in-out infinite",
        "float-delayed": "floatDelayed 4.5s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
        "spin-reverse-slow": "spinReverse 28s linear infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(2px, -7px)" },
        },
        floatDelayed: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(-3px, -5px)" },
        },
        spinReverse: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        glow: {
          "0%": { opacity: "0.5", filter: "drop-shadow(0 0 10px rgba(10,132,255,0.25))" },
          "100%": { opacity: "0.85", filter: "drop-shadow(0 0 22px rgba(109,93,251,0.45))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
