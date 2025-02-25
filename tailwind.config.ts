import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000",
        backgroundContrast: "#111",
        textBlack: "#1d1d1f",
        white: "#fff",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1.0625rem",
        lg: ["1.1875rem", "1.21"],
        xl: "1.3125rem",
        "2xl": "1.5rem",
        "3xl": "1.75rem",
        "4xl": "2.5rem",
        "5xl": ["4.5rem", "1.05"],
      },
    },
  },
  plugins: [],
} satisfies Config;
