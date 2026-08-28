/** @type {import('tailwindcss').Config} */
const { brand } = require('./src/core/theme/brand');

module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // bg-brand-500, text-brand-800, border-brand-500, etc.
      colors: { brand },
    },
  },
  plugins: [],
};
