/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        batik: {
          brown: '#4A2E18',
          dark: '#2A180B',
          light: '#8B5A2B',
          gold: '#C59B27',
          goldLight: '#E8C56A',
          cream: '#FAF6EE',
          creamDark: '#F0E6D2',
          indigo: '#1C2833',
          terracotta: '#A04000',
          soga: '#6E2C00'
        }
      }
    },
  },
  plugins: [],
};
