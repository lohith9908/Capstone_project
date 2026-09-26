/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ares: {
          dark: '#0a0d14',
          card: '#111726',
          border: '#1e293b',
          accent: '#06b6d4', // cyan-500
          danger: '#ef4444', // red-500
          warning: '#f59e0b', // amber-500
          success: '#10b981', // emerald-500
        }
      }
    },
  },
  plugins: [],
}
