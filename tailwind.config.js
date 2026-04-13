/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "background":               "#0e0e13",
        "surface":                  "#0e0e13",
        "surface-dim":              "#0e0e13",
        "surface-container-lowest": "#000000",
        "surface-container-low":    "#131319",
        "surface-container":        "#19191f",
        "surface-container-high":   "#1f1f26",
        "surface-container-highest":"#25252d",
        "surface-variant":          "#25252d",
        "on-surface":               "#f9f5fd",
        "on-background":            "#f9f5fd",
        "on-surface-variant":       "#acaab1",
        "primary":                  "#bb9eff",
        "primary-dim":              "#874cff",
        "on-primary":               "#3a008b",
        "secondary":                "#00cffc",
        "secondary-dim":            "#00c0ea",
        "on-secondary":             "#003a48",
        "tertiary":                 "#aaffdc",
        "on-tertiary":              "#00654b",
        "outline":                  "#76747b",
        "outline-variant":          "#48474d",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body:     ["Inter", "sans-serif"],
        label:    ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg:      "0.25rem",
        xl:      "0.75rem",
        "2xl":   "1rem",
        "3xl":   "1.5rem",
        full:    "9999px",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1) translateY(0)",    opacity: "0.18" },
          "50%":      { transform: "scale(1.12) translateY(-20px)", opacity: "0.28" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        breathe:    "breathe 8s ease-in-out infinite alternate",
        "spin-slow": "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [],
};
