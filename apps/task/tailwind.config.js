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
        // SRK colors
        srk: {
          gold: "#e1ba73",
          bronze: "#b68938",
          dark: "#0a0705",
        },

        // NextUI custom colors
        primary: "#b68938",
        bgPrimary: "#131212",
        bgSecondary: "#1b1d23",
        bgTernary: "#18181b",

        textPrimary: "#ffffff",
        textSecondary: "#ad8b3a",
      },

      /* --------------------------
       * BACKGROUND IMAGES
       * -------------------------- */
      backgroundImage: {
        "srk-gradient": "linear-gradient(135deg, #e1ba73 0%, #b68938 100%)",
        "srk-mesh":
          "radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.15), transparent 50%)",

        "custom-gradient": "linear-gradient(125deg, #e1ba73, #b68938)",
      },

      /* --------------------------
       * ANIMATIONS
       * -------------------------- */
      animation: {
        gradient: "gradient 3s ease infinite",
        "gradient-slow": "gradient 6s ease infinite",
      },

      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },

      /* --------------------------
       * SIZES
       * -------------------------- */
      maxWidth: {
        custom: "80rem",
      },
    },
  },

  plugins: [
    nextui(), // NextUI plugin enabled
  ],
};
