/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4F46E5',
          600: '#3730a3',
          700: '#312e81'
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#7C3AED',
          600: '#6d28d9',
          700: '#5b21b6'
        },
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#EC4899',
          600: '#db2777',
          700: '#be185d'
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}