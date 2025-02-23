import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    open: true,
  },
  build: {
    outDir: 'public/build',
    sourcemap: true,
  },
});
