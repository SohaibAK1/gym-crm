/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        surface: {
          DEFAULT: '#1F2937',
          100: '#111827',
          200: '#374151',
        },
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#9CA3AF',
        },
      },
      fontFamily: {
        condensed: ["'Barlow Condensed'", 'sans-serif'],
        sans: ["'Barlow'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
