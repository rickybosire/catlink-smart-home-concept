/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161617",
        graphite: "#1d1d1f",
        fog: "#f5f5f7",
        line: "#d2d2d7",
        muted: "#6e6e73",
        electric: "#275efe",
        cobalt: "#0a56cc",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      letterSpacing: { snug: "-0.035em", tighter: "-0.055em" },
      maxWidth: { shell: "1280px" },
      boxShadow: {
        float: "0 30px 80px -35px rgba(0,0,0,.35)",
        glow: "0 30px 100px -30px rgba(39,94,254,.65)",
      },
    },
  },
  plugins: [],
};
