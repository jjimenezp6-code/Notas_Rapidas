/** @type {import('tailwindcss').Config} */
export default {
  // 👇 el tema lo controlamos con la clase `dark` en <html>
  darkMode: 'class',

  // 👇 asegúrate de cubrir todas las rutas donde usamos clases
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './composables/**/*.{js,ts}'
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'ui-sans-serif', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'ui-sans-serif', 'sans-serif']
      },
      colors: {
        brand: {
          50:  '#fffbe6',
          100: '#fff3b0',
          200: '#ffe66d',
          300: '#ffd44d',
          400: '#ffbf1a',
          500: '#f5b000',
          600: '#d99400',
          700: '#b87700',
          800: '#8f5b00',
          900: '#6c4400'
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.08)',
        glow: '0 0 0 2px rgba(250,204,21,0.35)'
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.25rem'
      }
    }
  },

  plugins: []
}
