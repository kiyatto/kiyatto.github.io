/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gantari: ['Gantari', 'sans-serif'],
        diphylleia: ['Diphylleia', 'serif'],
        fragment: ['"Fragment Mono SC"', 'monospace'],
        athiti: ['Athiti', 'sans-serif'],
        'reenie-beanie': ['"Reenie Beanie"', 'cursive'],
      },
    },
  },
  plugins: [],
}
