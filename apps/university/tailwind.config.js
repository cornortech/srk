const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
    '../../libs/shared/ui/src/**/*.{js,jsx,ts,tsx}',
    '../../libs/shared/ui-components/src/**/*.{js,jsx,ts,tsx}',
    '../../libs/shared/hooks/src/**/*.{js,jsx,ts,tsx}',
    '../../libs/shared/store/src/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(125deg, #e1ba73, #b68938)",
      },
      colors: {
        primary: "#b68938",
        bgPrimary: "#131212",
        bgTernary: "#18181b",
        bgSecondary: "#1b1d23",
        textSecondary: "#ad8b3a",
        textPrimary: "#ffffff",
      },
      maxWidth: {
        custom: "80rem",
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
        "zoom-in": "zoomIn 5s ease-out forwards",
        "fade-in": "fadeIn 1.5s ease-out forwards",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
