/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // ✅ Target only relevant files
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}