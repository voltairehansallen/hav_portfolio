/** @type {import('tailwindcss').Config} */
function withOpacity(cssVar) {
  return ({ opacityValue }) =>
    opacityValue !== undefined
      ? `rgb(var(${cssVar}) / ${opacityValue})`
      : `rgb(var(${cssVar}))`;
}

module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: withOpacity('--color-bg'),
        panel: withOpacity('--color-panel'),
        'panel-border': withOpacity('--color-panel-border'),
        vision: withOpacity('--color-primary-500'), // accent principal — même nom de token, nouvelle valeur
        ambition: withOpacity('--color-ambition'), // accent secondaire
        muted: withOpacity('--color-muted'),
        online: withOpacity('--color-online'),
        primary: {
          50: withOpacity('--color-primary-50'),
          100: withOpacity('--color-primary-100'),
          200: withOpacity('--color-primary-200'),
          300: withOpacity('--color-primary-300'),
          400: withOpacity('--color-primary-400'),
          500: withOpacity('--color-primary-500'),
          600: withOpacity('--color-primary-600'),
          700: withOpacity('--color-primary-700'),
          800: withOpacity('--color-primary-800'),
          900: withOpacity('--color-primary-900'),
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(77,232,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(77,232,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};
