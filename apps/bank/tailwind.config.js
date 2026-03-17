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
      backgroundImage: {
        "custom-gradient": "linear-gradient(125deg, #e1ba73, #b68938)",
      },
      colors: {
        primary: "#b68938",
        // primary: "#ddb66e",
        bgPrimary: "#131212",
        bgTernary: "#18181b",
        // bgPrimary: "#06111b",
        bgSecondary: "#1b1d23",
        // bgSecondary: "#1e2831",
        textSecondary: "#ad8b3a",
        textPrimary: "#ffffff",
      },
      maxWidth: {
        custom: "80rem", // Custom max-width
      },
      keyframes: {
        zoomIn: {
          "0%": {
            transform: "scale(1.2)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        "zoom-in": "zoomIn 5s ease-out forwards", // Smooth zoom over 5 seconds
        "fade-in": "fadeIn 1.5s ease-out forwards", // Fade-in animation
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
  plugins: [nextui()],
};
