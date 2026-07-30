/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121317",
        surface: "#1C1E23",
        surfaceAlt: "#25272E",
        line: "#33353C",
        pulse: "#E63946",
        pulseDark: "#C22A36",
        signal: "#2EC4B6",
        amber: "#F4A340",
        mist: "#9AA0AA",
      },
      fontFamily: {
        display: ["'Oswald'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
