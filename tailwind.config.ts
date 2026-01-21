import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional Black & White Palette
        white: '#FFFFFF',
        black: '#000000',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        // Legacy support (for gradual migration)
        light: {
          bg: '#FFFFFF',
          text: '#000000',
          'text-secondary': '#525252',
          border: '#E5E5E5',
          accent: '#000000',
          glass: 'rgba(255, 255, 255, 0.7)',
        },
        dark: {
          bg: '#0A0A0A',
          text: '#FFFFFF',
          'text-secondary': '#A3A3A3',
          border: '#262626',
          accent: '#FFFFFF',
          glass: 'rgba(10, 10, 10, 0.7)',
          paper: '#141414',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        // Display (Large headings)
        'display-1': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        // Headings
        'heading-1': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-2': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        // Body
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        // Labels (uppercase metadata)
        'label': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '600' }],
        'label-lg': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em', fontWeight: '600' }],
        // Technical (monospace code/data)
        'technical': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'technical-sm': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
