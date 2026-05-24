/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        accent: '#3b82f6',     // blue-500
        success: '#34d399',    // emerald-400
      },
    },
  },
  plugins: [],
}
