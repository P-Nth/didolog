import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{svelte,ts,js}",
    "node_modules/@melt-ui/svelte/**/*.{svelte,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;

