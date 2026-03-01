import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0C0C0E',
          card: '#141414',
          'card-hover': '#1a1a1a',
          elevated: '#161618',
          surface: '#1E1E21',
          hover: '#242428',
        },
        text: {
          primary: '#f5f5f5',
          secondary: '#999999',
          muted: '#666666',
        },
        border: {
          DEFAULT: '#222222',
          hover: '#333333',
        },
        accent: {
          DEFAULT: '#8B5CF6',
          hover: '#A78BFA',
          subtle: 'rgba(139, 92, 246, 0.08)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Fira Code', 'monospace'],
      },
      animation: {
        'cursor-blink': 'cursorBlink 1s step-end infinite',
        'hero-breathe': 'breathe 8s ease-in-out infinite',
      },
      keyframes: {
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.06' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
