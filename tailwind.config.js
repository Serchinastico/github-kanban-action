/** @type {import('tailwindcss').Config} */
export default {
  content: ["./template/**/*.html", "./out/**/*.html"],
  theme: {
    colors: {
      ash: "#1E1F25",
      cloud: "#F2F3F8",
      white: "#FFFFFF",
    },
    extend: {
      fontFamily: {
        marker: ["Permanent Marker", "cursive"],
        space: ["Space Mono", "monospace"],
      },
      rotate: {
        0.5: "0.5deg",
      },
    },
  },
  plugins: [],
};
