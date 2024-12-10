/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': {'max': '639px'},    // Small screens up to 639px
        'md': {'max': '767px'},    // Medium screens up to 767px
        'lg': {'max': '1023px'},   // Large screens up to 1023px
        'xl': {'max': '1279px'},   // Extra-large screens up to 1279px
        '2xl': {'max': '1535px'},  // 2x Large screens up to 1535px
      },
    },
  },
  plugins: [],
}
