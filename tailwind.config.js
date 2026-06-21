/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F5F0E8',
        card: '#FDFAF4',
        forest: {
          DEFAULT: '#2D4A2D',
          light: '#3D6B3D',
          muted: '#4A7C59',
        },
        moss: '#6B8F5E',
        bark: '#8B6F47',
        clay: '#C4956A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
