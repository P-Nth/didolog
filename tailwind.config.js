// Use ESM (ES Modules) instead of CommonJS
import flowbite from "flowbite/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{svelte,ts,js}",
    "node_modules/flowbite-svelte/**/*.{svelte,js,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite],
};
