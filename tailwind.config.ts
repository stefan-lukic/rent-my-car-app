/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#020617',
        'ink-secondary': '#0F172A',
        body: '#334155',
        border: '#E2E8F0',
        brand: '#2563EB',
        'brand-dark': '#1D4ED8',
        'brand-light': '#DBEAFE',
        'brand-tint': '#EFF6FF',
        surface: '#F8FAFC',
        'surface-0': '#FFFFFF',
        success: '#059669',
        'success-tint': '#ECFDF5',
        warning: '#D97706',
        'warning-tint': '#FFFBEB',
        danger: '#DC2626',
        'danger-tint': '#FEF2F2',
      },
      fontFamily: {
        heading: ['var(--font-manrope)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
