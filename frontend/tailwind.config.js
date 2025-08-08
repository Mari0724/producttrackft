/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        // 🎨 Tus colores originales
        'wine-dark': '#811D28',
        'gray-light': '#D3D3D3',
        'gray-dark': '#333333',
        'mustard-yellow': '#FFBA21',
        'olive-green': '#495E2C',
        'white-pure': '#FFFFFF',

        // 🎨 Compañera
        olive: '#808000',
        burgundy: '#800020',
        golden: '#F2C94C',
        lightgray: '#E0E0E0',
        white: '#FFFFFF',
        'producttrack-olive': '#808000',
        'producttrack-yellow': '#F2C94C',
        'producttrack-wine': '#800020',
        'producttrack-lightgray': '#E0E0E0',
        'producttrack-white': '#FFFFFF',
        'wine-red': '#800020',
        'food-yellow': '#F2C94C',
        'light-gray': '#E0E0E0',
        'white-pt': '#FFFFFF',
        vinotinto: '#800020',
        'verde-oliva': '#808000',
        amarillo: '#F2C94C',
        'gris-claro': '#E0E0E0',

        // 🎨 HSL system colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#808000',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#E0E0E0',
          foreground: '#333333',
        },
        destructive: {
          DEFAULT: '#800020',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#E0E0E0',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#F2C94C',
          foreground: '#333333',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#333333',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#333333',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'bounce-gentle': {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(-10px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce-gentle 1s infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
