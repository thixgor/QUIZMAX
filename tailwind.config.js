/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark-blue': 'rgba(42, 60, 138, 1)',
        'brand-light-blue': 'rgba(24, 173, 229, 1)',
        'brand-orange': 'rgba(241, 141, 47, 1)',
      },
    },
  },
  plugins: [],
}
