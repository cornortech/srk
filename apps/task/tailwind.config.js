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
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
