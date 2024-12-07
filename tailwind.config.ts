import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        flair: "#5dddac",
        "card-gray": "#1f1f1f",
        "site-gray": "#181818",
        "desc-gray": "#9ca3af",
        "link-purple": "#98a0fa",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
