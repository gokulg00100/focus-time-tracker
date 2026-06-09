/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Primary color reads from CSS custom properties so theme switching
        // (Classic / F1 Racing / FIFA World Cup) works at runtime.
        primary: {
          50:  'rgb(var(--p-50)  / <alpha-value>)',
          100: 'rgb(var(--p-100) / <alpha-value>)',
          200: 'rgb(var(--p-200) / <alpha-value>)',
          300: 'rgb(var(--p-300) / <alpha-value>)',
          400: 'rgb(var(--p-400) / <alpha-value>)',
          500: 'rgb(var(--p-500) / <alpha-value>)',
          600: 'rgb(var(--p-600) / <alpha-value>)',
          700: 'rgb(var(--p-700) / <alpha-value>)',
          800: 'rgb(var(--p-800) / <alpha-value>)',
          900: 'rgb(var(--p-900) / <alpha-value>)',
          950: 'rgb(var(--p-950) / <alpha-value>)',
        },
      },
      animation: {
        'pulse-slow':        'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':         'spin 3s linear infinite',
        'bounce-subtle':     'bounce 2s infinite',
        'fade-in':           'fadeIn 0.3s ease-in-out',
        'slide-up':          'slideUp 0.3s ease-out',
        'scale-in':          'scaleIn 0.2s ease-out',
        'slide-from-right':  'slideFromRight 0.35s ease-out',
        'slide-from-left':   'slideFromLeft 0.35s ease-out',
        'float':             'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        slideFromRight: {
          '0%':   { transform: 'translateX(40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        slideFromLeft: {
          '0%':   { transform: 'translateX(-40px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        // Glow uses the current primary CSS variable so it follows the theme
        glow:    '0 0 20px rgb(var(--p-500) / 0.3)',
        'glow-lg': '0 0 40px rgb(var(--p-500) / 0.4)',
      },
    },
  },
  plugins: [],
}
