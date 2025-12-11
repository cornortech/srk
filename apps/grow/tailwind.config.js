const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

    // monorepo shared libs
    "../../libs/shared/ui/src/**/*.{js,jsx,ts,tsx}",
    "../../libs/shared/ui-components/src/**/*.{js,jsx,ts,tsx}",
    "../../libs/shared/hooks/src/**/*.{js,jsx,ts,tsx}",
    "../../libs/shared/store/src/**/*.{js,jsx,ts,tsx}",

    // NextUI theme
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      /* --------------------------
       * FONTS
       * -------------------------- */
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },

      /* --------------------------
       * COLORS
       * -------------------------- */
      colors: {
        primary: "#00A86B",
        secondary: "#FFB20E",
        success: "#00D084",
        warning: "#FF7A00",
        danger: "#FF5757",
        info: "#0066FF",
        dark: "#0f172a",
        light: "#f1f5f9",
      },

      /* --------------------------
       * BACKGROUNDS
       * -------------------------- */
      backgroundColor: {
        bgPrimary: "#0f172a",
        bgSecondary: "#1e293b",
      },

      /* --------------------------
       * TEXT COLORS
       * -------------------------- */
      textColor: {
        textPrimary: "#f1f5f9",
        textSecondary: "#cbd5e1",
        textTertiary: "#94a3b8",
      },

      /* --------------------------
       * BORDERS
       * -------------------------- */
      borderColor: {
        borderPrimary: "#334155",
        borderSecondary: "#475569",
      },

      /* --------------------------
       * OPACITY
       * -------------------------- */
      opacity: {
        5: "0.05",
        10: "0.1",
      },

      /* --------------------------
       * SHADOWS
       * -------------------------- */
      boxShadow: {
        custom: "0 4px 6px rgba(0, 0, 0, 0.1)",
        "custom-lg": "0 10px 15px rgba(0, 0, 0, 0.1)",
      },

      /* --------------------------
       * SPACING
       * -------------------------- */
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },

      /* --------------------------
       * BORDER RADIUS
       * -------------------------- */
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
      },
    },
  },

  plugins: [nextui()],
};
