/** @type {import('tailwindcss').Config} */
const { Colors } = require("./constants/Colors");

const themes = Object.keys(Colors); // ['joy', 'serenity', ...]
const properties = ["primary", "background"];

const themedColors = {};

for (const theme of themes) {
  for (const prop of properties) {
    // Generate class names like 'joy-primary': '#FFD700'
    themedColors[`${theme}-${prop}`] = Colors[theme][prop];
  }
}

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./app/(tabs)/index.tsx",
  ],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(joy|serenity|tension|sorrow|fury|haze)-(primary|background|gradientStart|gradientEnd|text|accent|surface)/,
    },
  ],
  presets: [require("nativewind/preset")], // Ensures NativeWind is recognized
  theme: {
    extend: {
      fontFamily: {
        heartful: ["Heartful", "sans-serif"],
      },
      colors: {
        ...themedColors,
      },
    },
  },
  plugins: [],
};
