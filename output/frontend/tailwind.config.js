/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        success: '#16A34A',
        danger: '#DC2626',
        'neutral-900': '#111827',
        'neutral-500': '#6B7280',
        surface: '#F9FAFB',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      }
    },
  },
  plugins: [],
}
