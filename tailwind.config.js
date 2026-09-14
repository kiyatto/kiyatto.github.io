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
        'dm-mono': ['"DM Mono"', 'monospace'],
        diphylleia: ['Diphylleia', 'serif'],
        fragment: ['"Fragment Mono SC"', 'monospace'],
        athiti: ['Athiti', 'sans-serif'],
        'reenie-beanie': ['"Reenie Beanie"', 'cursive'],
        'source-serif': ['"Source Serif 4"', 'serif'],
        museum: ['"PP Museum"', 'serif'],
        stellar: ['"PP Stellar"', 'sans-serif'],
        kode: ['"Kode Mono"', 'monospace'],
        doto: ['Doto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
