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
        "midnight-blue": "#1A202C",
        "sage-green": "#738678",
        "sunset-orange": "#FF6B6B",
        "slate-gray": "#7A8C99",
        "cloud-white": "#F9FAFB",
      },
    },
  },
  plugins: [],
} satisfies Config;
