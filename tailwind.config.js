/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roseSoft: '#FFE4E6',
        rosePrimary: '#F43F5E',
        roseDark: '#BE123C',
        fertileRed: '#E11D48',
        cautionYellow: '#F59E0B',
        safeGreen: '#10B981',
      }
    },
  },
  plugins: [],
}
