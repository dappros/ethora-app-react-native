/**
 * Brand palette (mirror of brand-* from ethora-app-reactjs/tailwind.config.js).
 * CommonJS because the file is read by both tailwind.config.js and RN code.
 */
const brand = {
  50: '#F3F4FC',
  100: '#E7EAF9',
  200: '#C2D1F0',
  300: '#99B4E6',
  400: '#437ED4',
  500: '#0052CD',
  600: '#004AC2',
  700: '#0040B6',
  800: '#0035AB',
  900: '#002398',
  950: '#001766',
};

/** linear-gradient(135deg, brand-500 0%, brand-800 100%) in expo-linear-gradient terms */
const brandGradient = {
  colors: [brand[500], brand[800]],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

module.exports = { brand, brandGradient };
