import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{svelte,ts,js}",
    "node_modules/@melt-ui/svelte/**/*.{svelte,ts}"
  ],
  theme: {
    extend: {
      boxShadow: {
        primary: '0 2px 5px rgba(0, 0, 0, 0.15)',
        secondary: '0 0 0 2px rgba(74, 144, 226, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;

