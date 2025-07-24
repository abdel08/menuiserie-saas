/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}', // Adapter selon ton arborescence
  ],
  theme: {
    extend: {
      colors: {
        border: '#d1d5db', // facultatif si tu veux réutiliser `border-border`
      },
    },
  },
  plugins: [],
}
