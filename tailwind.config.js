/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'aw-bg': '#0D0E12',
        'aw-surface': '#111216',
        'aw-border': '#2A2D35',
        'aw-text': '#E8E9EA',
        'aw-text-secondary': '#8B8D93',
        'aw-blue': '#2979FF',
        'aw-green': '#00D4AA',
        'aw-amber': '#F5A623',
        'aw-red': '#FF4D4F',
        'aw-purple': '#7B61FF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
