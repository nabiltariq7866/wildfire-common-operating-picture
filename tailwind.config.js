/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--c-text-primary) / <alpha-value>)',
        muted: 'rgb(var(--c-text-secondary) / <alpha-value>)',
        faint: 'rgb(var(--c-text-muted) / <alpha-value>)',
        surface: 'rgb(var(--c-bg-surface) / <alpha-value>)',
        panel: 'rgb(var(--c-bg-secondary) / <alpha-value>)',
        elevated: 'rgb(var(--c-bg-elevated) / <alpha-value>)',
        line: 'rgb(var(--c-border) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
        warning: 'rgb(var(--c-warning) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
        purple: 'rgb(var(--c-purple) / <alpha-value>)'
      }
    }
  },
  plugins: []
}
