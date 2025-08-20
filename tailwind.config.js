/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // PuredgeOS Mobile-First Breakpoints
      screens: {
        'xs': '480px',    // Extra small devices
        'sm': '640px',    // Small devices
        'md': '768px',    // Medium devices
        'lg': '1024px',   // Large devices
        'xl': '1280px',   // Extra large devices
        '2xl': '1536px',  // 2X large devices
      },
      
      // PuredgeOS Brand Colors
      colors: {
        obsidian: '#1E1F23',
        serum: '#00C2B2',
        sandstone: '#E4E2DD',
        solar: '#D4FF4F',
        midnight: '#121D2B',
        
        // Semantic color aliases
        'brand-primary': '#00C2B2',
        'brand-accent': '#D4FF4F',
        'brand-danger': '#FF5A5F',
        
        // Background colors
        'background-canvas': 'var(--background-canvas)',
        'background-surface': 'var(--background-surface)',
        
        // Text colors
        'text-body': 'var(--text-body)',
        'text-heading': 'var(--text-heading)',
        'text-muted': 'var(--text-muted)',
        'text-link': 'var(--text-link)',
        
        // Border colors
        'border-default': 'var(--border-default)',
        'border-focus': 'var(--border-focus)',
      },
      
      // PuredgeOS Typography
      fontFamily: {
        'heading': ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      
      // Mobile-first spacing scale (4px baseline)
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',  // Minimum touch target
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      
      // Mobile-first border radius
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'full': '9999px',
      },
      
      // Mobile-first typography scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.4' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
        'base': ['1rem', { lineHeight: '1.5' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.6' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.5' }],      // 20px
        '2xl': ['1.5rem', { lineHeight: '1.4' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '1.3' }],    // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],        // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],     // 60px
      },
      
      // Mobile-first animation durations
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // Mobile-first container max-widths
      maxWidth: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    // Custom plugin for touch-friendly buttons
    function({ addUtilities }) {
      const newUtilities = {
        '.touch-target': {
          'min-height': '48px',
          'min-width': '48px',
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.mobile-safe-area': {
          'padding-left': 'env(safe-area-inset-left)',
          'padding-right': 'env(safe-area-inset-right)',
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
