/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      fontFamily: {
        inter: ['Inter var', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(189,192,207,0.2)',
        cardhover: '0 0 1px 0 rgba(189,192,207,0.06),0 10px 16px -1px rgba(189,192,207,0.4)',
      },
      // colors: {
      //   accent: {
      //     1: "hsl(var(--color-accent1) / <alpha-value>)",
      //     2:  "hsl(var(--color-accent2) / <alpha-value>)",
      //   },
      //   bkg: "hsl(var(--color-bkg) / <alpha-value>)",
      //   content: "hsl(var(--color-content) / <alpha-value>)",
      // },
    },
  },
  plugins: [],
  darkMode: "class",
};