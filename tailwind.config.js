import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./frontend/**/*.{js,ts,vue,html}"
  ],
  theme: {
    extend: {
      colors: {
        font: {
          light: '#000000',
          dark: '#ffffff'
        },
        backgorund: {
          light: 'hsl(0, 0%, 97%)',
          dark: 'hsl(180, 80%, 3%)'
        },
        container: {
          light: 'hsl(0, 0%, 98%)',
          dark: 'hsl(200, 20%, 13%)',
          border: {
            light: 'hsl(0, 0%, 80%)',
            dark: 'hsl(0, 0%, 25%)'
          },
          secondary: {
            light: 'hsl(0, 0%, 95%)',
            dark: 'hsl(200, 20%, 18%)'
          }
        },
        interactable: {
          light: 'hsl(0, 0%, 100%)',
          dark: 'hsl(180, 30%, 18%)',
          border: {
            light: 'hsl(0, 0%, 75%)',
            dark: 'hsl(0, 0%, 30%)'
          }
        },
        scrollbar: {
          backgorund: { 
            light: colors.slate[100],
            dark: '#30363D'
          },
          thumb: {
            light: colors.slate[400],
            dark: '#505A66'
          }
        },
        accent: {
          DEFAULT: '#be1622',
          dark: '#7F0F18'
        },

      },
      borderWidth: {
        1: '1px',
      }
    },
  },
  plugins: [],
}
