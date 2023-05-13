/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    container: {
      padding: '2rem',
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require("daisyui")],
}

