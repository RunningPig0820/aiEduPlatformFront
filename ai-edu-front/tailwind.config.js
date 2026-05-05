/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Inter'",
          "'Noto Sans SC'",
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        'card-elevated': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(13,148,136,0.05) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #4F46E5 0%, #0D9488 100%)',
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'lg': '12px',
        'xl': '16px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        btnPress: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-out forwards',
        btnPress: 'btnPress 150ms ease-in-out',
      },
      transitionProperty: {
        'button': 'transform, box-shadow, background-color',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        "aiedu-light": {
          "primary": "#4F46E5",
          "primary-content": "#FFFFFF",
          "secondary": "#0D9488",
          "secondary-content": "#FFFFFF",
          "accent": "#7C3AED",
          "accent-content": "#FFFFFF",
          "neutral": "#1E293B",
          "neutral-content": "#F8FAFC",
          "base-100": "#FAFAF9",
          "base-200": "#F5F5F4",
          "base-300": "#E7E5E4",
          "base-content": "#1C1917",
          "info": "#0EA5E9",
          "info-content": "#FFFFFF",
          "success": "#10B981",
          "success-content": "#FFFFFF",
          "warning": "#F59E0B",
          "warning-content": "#FFFFFF",
          "error": "#EF4444",
          "error-content": "#FFFFFF",
        },
      },
    ],
    base: false,
  },
}
