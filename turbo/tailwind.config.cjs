const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config}*/
const config = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './src/**/*.{html,svelte,js,ts}',
    './node_modules/svelte-ux/**/*.{svelte,js}',
    './node_modules/layerchart/**/*.{svelte,js}'
  ],
  theme: {
    extend: {
      colors: {
        accent: colors.indigo
      }
    }
  },

  plugins: [require('svelte-ux/plugins/tailwind.cjs')]
};

module.exports = config;
