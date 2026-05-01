import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // emerald green - pet/nature theme
        secondary: '#f59e0b', // amber
        accent: '#ec4899', // pink
        'vc-slate-900': '#0f172a',
        'vc-slate-700': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'md-emerald': '0 6px 18px -6px rgba(16,185,129,0.24)',
      },
      ringWidth: {
        4: '4px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config
