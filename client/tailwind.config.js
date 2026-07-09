/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep dark backgrounds
        dark: {
          950: '#04030a',
          900: '#080712',
          800: '#0d0b1a',
          700: '#12102a',
          600: '#1a1833',
          500: '#241f42',
        },
        // Primary purple-violet
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Accent violet/purple
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        // Cyan accent
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Pink accent
        pink: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
        // Surface colors for dark UI
        surface: {
          50: 'rgba(255,255,255,0.03)',
          100: 'rgba(255,255,255,0.05)',
          200: 'rgba(255,255,255,0.08)',
          300: 'rgba(255,255,255,0.12)',
          400: 'rgba(255,255,255,0.16)',
          500: 'rgba(255,255,255,0.20)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'aurora': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 40, 200, 0.5), transparent), radial-gradient(ellipse 50% 80% at 80% 50%, rgba(0, 180, 216, 0.15), transparent)',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'glow-purple': 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
        'gradient-dark': 'linear-gradient(135deg, #0d0b1a 0%, #12102a 50%, #0d0b1a 100%)',
      },
      animation: {
        'aurora': 'aurora 8s ease-in-out infinite alternate',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'border-glow': 'border-glow 2s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%', opacity: '0.7' },
          '50%': { backgroundPosition: '100% 50%', opacity: '1' },
          '100%': { backgroundPosition: '0% 50%', opacity: '0.7' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(124, 58, 237, 0.3)',
        'glow': '0 0 30px rgba(124, 58, 237, 0.4)',
        'glow-lg': '0 0 60px rgba(124, 58, 237, 0.5)',
        'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(124, 58, 237, 0.2)',
      },
    },
  },
  plugins: [],
}
