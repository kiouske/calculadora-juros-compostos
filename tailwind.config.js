/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f7f8',
          100: '#ececf0',
          200: '#d3d3db',
          300: '#b0b0bb',
          400: '#8d8d9c',
          500: '#6f6f80',
          600: '#555566',
          700: '#3e3e4d',
          800: '#2a2a35',
          900: '#18181f',
        }
      }
    },
  },
  plugins: [],
}