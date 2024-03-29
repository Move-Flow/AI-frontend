import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "0.9rem",
    },
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        ibm: ["IBM Plex Sans Hebrew", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
