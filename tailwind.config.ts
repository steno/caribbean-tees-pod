import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Costambar Beach Theme
        sand: {
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5ede3',
          300: '#ebe0d1',
          400: '#dcc9b0',
          500: '#c9af8f',
          600: '#b5956e',
          700: '#9b7b55',
          800: '#7a6144',
          900: '#5c4933',
        },
        ocean: {
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#99eefd',
          300: '#5ce0fa',
          400: '#1cc8ee',
          500: '#00acd4',
          600: '#0389b2',
          700: '#096d90',
          800: '#105975',
          900: '#124a62',
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd6cc',
          300: '#ffb8a8',
          400: '#ff8e75',
          500: '#ff6b4a',
          600: '#ed4d26',
          700: '#c83c1a',
          800: '#a5351a',
          900: '#88321e',
        },
        palm: {
          50: '#f4f9f5',
          100: '#e6f3e8',
          200: '#cee6d2',
          300: '#a6d1ad',
          400: '#75b481',
          500: '#52975f',
          600: '#3f7a4a',
          700: '#34603d',
          800: '#2c4d33',
          900: '#25402b',
        },
      },
    },
  },
  plugins: [],
}
export default config

