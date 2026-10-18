/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#2563EB',
          700: '#1D4ED8',
        },
        neutral: {
          900: '#111827',
          500: '#6B7280',
        },
        error: {
          500: '#DC2626',
        },
        success: {
          500: '#16A34A',
        },
        surface: {
          100: '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}