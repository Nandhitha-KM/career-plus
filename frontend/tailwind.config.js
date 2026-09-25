/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        blossom: {
          bg: '#FFF5F7',
          rose: '#e11d48',
          pink: '#ec4899',
          plum: '#881337',
          peach: '#f59e0b',
        }
      },
      boxShadow: {
        'rose-sm': '0 4px 20px -2px rgba(225, 29, 72, 0.12)',
        'rose-md': '0 8px 30px -4px rgba(225, 29, 72, 0.18)',
        'rose-lg': '0 12px 40px -6px rgba(225, 29, 72, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
