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
        // 1. CREAM (Soft warm background & card highlights)
        cream: {
          50: '#FFFEFC',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EFE7E0',
          400: '#E4D9CE',
          500: '#D7C7B7',
          600: '#BFAB97',
        },
        // 2. SAND (Warm earthy neutrals, borders, subtle text & secondary elements)
        sand: {
          50: '#FDFBF7',
          100: '#F6F1EA',
          200: '#EAE0D3',
          300: '#DCCEBD',
          400: '#CBB7A2',
          500: '#B59D85',
          600: '#9C8269',
          700: '#7E6650',
          800: '#614D3C',
          900: '#46372B',
        },
        // 3. DUSTY PINK (Soft accents, expense badges, chart highlights, friendly tags)
        dustypink: {
          50: '#FDF7F8',
          100: '#FAECF0',
          200: '#F5D7DE',
          300: '#EDBCC7',
          400: '#E09CA9',
          500: '#D27F8F',
          600: '#BC6173',
          700: '#A04A5C',
          800: '#833948',
          900: '#672A36',
        },
        // 4. BURGUNDY (Deep royal primary brand color, buttons, active links, dark mode background)
        burgundy: {
          50: '#FAF0F2',
          100: '#F4DEE3',
          200: '#E9BAC5',
          300: '#D88EA0',
          400: '#BF5972',
          500: '#9B2D46',
          600: '#801E35', // Primary brand Burgundy
          700: '#681327',
          800: '#520B1C',
          900: '#3D0613',
          950: '#1F0309', // Midnight Burgundy for Dark Mode
        },
        // Semantic brand aliases mapped to Burgundy for backward-compatibility
        brand: {
          50: '#FAF0F2',
          100: '#F4DEE3',
          200: '#E9BAC5',
          300: '#D88EA0',
          400: '#BF5972',
          500: '#9B2D46',
          600: '#801E35',
          700: '#681327',
          800: '#520B1C',
          900: '#3D0613',
          950: '#1F0309',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(104, 19, 39, 0.05)',
        'soft-lg': '0 10px 25px -3px rgba(104, 19, 39, 0.08)',
        'burgundy-glow': '0 4px 20px rgba(128, 30, 53, 0.25)',
        'pink-glow': '0 4px 20px rgba(210, 127, 143, 0.25)',
      }
    },
  },
  plugins: [],
}
