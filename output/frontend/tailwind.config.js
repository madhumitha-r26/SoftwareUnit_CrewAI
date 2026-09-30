/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#2563EB',
        },
        success: {
          500: '#10B981',
        },
        danger: {
          500: '#EF4444',
        },
        neutral: {
          900: '#111827',
          100: '#F3F4F6',
        },
        accent: {
          500: '#F59E0B',
        },
      },
      borderRadius: {
        'custom': '8px',
      }
    },
  },
  plugins: [],
}