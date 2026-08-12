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
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          card: 'var(--color-bg-card)',
          hover: 'var(--color-bg-hover)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        accent: {
          orange: 'var(--color-accent-orange)',
          orangeHover: 'var(--color-accent-orange-hover)',
          navy: 'var(--color-accent-navy)',
          navyHover: 'var(--color-accent-navy-hover)',
          green: 'var(--color-accent-green)',
          greenHover: 'var(--color-accent-green-hover)',
          yellow: 'var(--color-accent-yellow)',
          yellowHover: 'var(--color-accent-yellow-hover)',
        },
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'monospace'],
      },
      // Rounder, softer corner scale — reads as an approachable campus/edtech
      // product rather than an angular corporate console.
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px',
        '2xl': '22px',
        '3xl': '28px',
      },
      // Hairline default instead of a heavy drawn-in-ink stroke — the
      // colour + soft elevation now do the work of separating surfaces.
      borderWidth: {
        DEFAULT: '1px',
      },
      boxShadow: {
        sm: '0 1px 3px 0 var(--color-shadow-hard-soft)',
        DEFAULT: '0 2px 8px -1px var(--color-shadow-hard-soft)',
        md: '0 4px 14px -2px var(--color-shadow-hard-soft)',
        lg: '0 10px 26px -4px var(--color-shadow-hard-soft)',
        xl: '0 18px 40px -8px var(--color-shadow-hard-soft)',
        '2xl': '0 26px 56px -12px var(--color-shadow-hard-soft)',
        inner: 'inset 0 2px 4px 0 var(--color-shadow-hard-soft)',
        premium: '0 12px 28px -6px var(--color-shadow-hard)',
        glass: '0 8px 24px -6px var(--color-shadow-hard-soft)',
      }
    },
  },
  plugins: [],
}
