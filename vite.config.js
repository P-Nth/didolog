import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from "svelte-preprocess";

export default defineConfig({
  plugins: [svelte({
    preprocess: sveltePreprocess({
        postcss: true,
      }),
  })],
  server: {
    open: true,
  },
  build: {
    outDir: 'public/build',
    sourcemap: true,
  },
});


