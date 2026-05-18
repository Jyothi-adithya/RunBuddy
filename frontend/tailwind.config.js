/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff4f1',
          100: '#ffe5de',
          200: '#ffc8ba',
          300: '#ffa28c',
          400: '#ff7d61',
          500: '#ff5f3f',
          600: '#ef4a2a',
          700: '#c83a1f',
          800: '#a4321e',
          900: '#872f22',
        },
        ink: {
          50: '#f6f7fb',
          100: '#eceff7',
          200: '#d7dcec',
          300: '#b3bdd6',
          400: '#7f8cab',
          500: '#5c6686',
          600: '#454f6c',
          700: '#343c54',
          800: '#252b3e',
          900: '#171b2c',
        },
      },
      borderRadius: {
        pill: '9999px',
        card: '1.25rem',
        soft: '0.875rem',
      },
      boxShadow: {
        glass: '0 16px 40px rgba(23, 27, 44, 0.14)',
        glow: '0 12px 30px rgba(239, 74, 42, 0.24)',
      },
      backgroundImage: {
        'hero-coral': 'radial-gradient(circle at 8% 10%, rgba(255, 125, 97, 0.42), transparent 30%), radial-gradient(circle at 92% 20%, rgba(239, 74, 42, 0.28), transparent 35%), linear-gradient(140deg, #171b2c 0%, #252b3e 55%, #343c54 100%)',
        'app-surface': 'radial-gradient(circle at 2% 0%, rgba(255, 200, 186, 0.55), transparent 30%), radial-gradient(circle at 100% 100%, rgba(255, 162, 140, 0.35), transparent 35%), linear-gradient(180deg, #f6f7fb 0%, #ffffff 100%)',
      },
      fontFamily: {
        heading: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 500ms ease-out both',
      },
    },
  },
  plugins: [],
}