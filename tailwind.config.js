/** @type {import('tailwindcss').Config} */
export default {
  content: ["./template/**/*.html", "./out/**/*.html"],
  theme: {
    colors: {
      ash: "#1E1F25",
      white: "#FFFFFF",
    },
    extend: {
      fontFamily: {
        marker: ["Permanent Marker", "cursive"],
        space: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
