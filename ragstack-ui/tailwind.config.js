/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("./src/components/subframe/tailwind.config.js")],
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}', "./src/components/subframe/**/*.{js,ts, isx, tsx}",],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
};

