/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'uk-primary': '#003366', // Example: A deep blue
        'uk-secondary': '#FDB813', // Example: A gold/yellow accent
      },
    },
  },
  plugins: [],
};