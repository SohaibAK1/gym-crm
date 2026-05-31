/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        rb: {
          bg:      '#0A0A0A',
          surface: '#141414',
          card:    '#1E1C18',
          border:  'rgba(250,204,21,0.14)',
        },
        primary: {
          DEFAULT: '#FACC15',
          50:  '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
          950: '#422006',
        },
        neon: {
          DEFAULT: '#FACC15',
          dim:     'rgba(250,204,21,0.15)',
        },
        surface: {
          DEFAULT: '#141414',
          100: '#0A0A0A',
          200: '#1E1C18',
        },
        muted: {
          DEFAULT: 'rgba(255,255,255,0.5)',
          foreground: 'rgba(255,255,255,0.65)',
        },
      },
      fontFamily: {
        condensed: ["'Barlow Condensed'", 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ["'IBM Plex Mono'", 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
