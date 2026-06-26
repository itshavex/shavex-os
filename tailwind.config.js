/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030304',
        surface: '#0d0d12',
        surfaceHover: '#16161b',
        border: 'rgba(255, 255, 255, 0.08)',
        primary: '#f9f9f9',
        secondary: '#a1a1aa',
        accent: '#3b82f6', // blue
        success: '#10b981', // green
        danger: '#ef4444', // red
        warning: '#f59e0b', // orange
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
