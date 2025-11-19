import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9e9ff",
          200: "#b3d3ff",
          300: "#8cbcff",
          400: "#569cff",
          500: "#317cf5",
          600: "#215fd2",
          700: "#184aab",
          800: "#133a88",
          900: "#102f6d"
        }
      }
    }
  },
  plugins: []
};

export default config;
