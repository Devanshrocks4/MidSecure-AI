/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background layers
        'bg-base': '#0a0f1c',
        'bg-canvas': '#0d1424',
        // Surface colors
        'surface-1': 'rgba(18, 28, 52, 0.8)',
        'surface-2': 'rgba(24, 36, 68, 0.85)',
        'surface-3': 'rgba(32, 48, 90, 0.9)',
        // Border colors
        'border-soft': 'rgba(88, 166, 255, 0.08)',
        'border': 'rgba(88, 166, 255, 0.15)',
        'border-strong': 'rgba(88, 166, 255, 0.25)',
        // Brand colors
        'primary': '#22d3ee',
        'primary-glow': 'rgba(34, 211, 238, 0.25)',
        'secondary': '#818cf8',
        'accent': '#c084fc',
        // Status colors
        'success': '#34d399',
        'warning': '#fbbf24',
        'critical': '#f43f5e',
        'info': '#818cf8',
        // Text colors
        'text': '#f1f5f9',
        'text-soft': '#cbd5e1',
        'text-dim': '#94a3b8',
        'text-muted': '#64748b',
      },
      fontFamily: {
        'display': ['Cormorant Garamond', 'Georgia', 'serif'],
        'body': ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'ui': ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['Space Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'sm': '10px',
        'DEFAULT': '16px',
        'lg': '24px',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(34, 211, 238, 0.15)',
        'glow-lg': '0 0 60px rgba(34, 211, 238, 0.25)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'ecg-draw': 'draw-ecg 2.4s linear infinite',
        'floating': 'floating 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'blip-pulse': 'blip-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px #22d3ee)' },
          '50%': { filter: 'drop-shadow(0 0 16px #22d3ee)' },
        },
        'radar-sweep': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'draw-ecg': {
          '0%': { strokeDashoffset: '600', opacity: '1' },
          '80%': { strokeDashoffset: '0', opacity: '1' },
          '100%': { strokeDashoffset: '0', opacity: '0' },
        },
        'floating': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'blip-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.6' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
