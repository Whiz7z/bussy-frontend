/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#333C7C',
        'accent': '#FFB700',
        'background': '#DADADA',
        'text-color': '#FFFFFF'
      },
    },
  },
  plugins: [],
}

