
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#000000',
          dark: '#0a0a0a',
          green: '#10b981',
          'green-dim': '#10b98180',
          amber: '#f59e0b',
          'amber-dim': '#f59e0b80',
          red: '#ef4444',
          'red-dim': '#ef444480',
        },
        neon: {
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
      },
      boxShadow: {
        'neon-green': '0 0 5px #10b98140, 0 0 10px #10b98120',
        'neon-amber': '0 0 5px #f59e0b40, 0 0 10px #f59e0b20',
        'neon-red': '0 0 5px #ef444440, 0 0 10px #ef444420',
      }
    },
  },
  plugins: [],
}
