/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './public/app.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        burger: { bun: '#D97706', meat: '#78350F', lettuce: '#22C55E', cheese: '#FACC15', sauce: '#F97316' },
        space: { 900: '#0B0F19', 800: '#111827', 700: '#1F2937' }
      }
    }
  }
};
