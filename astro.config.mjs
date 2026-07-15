import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://iostudentebrescia.it',
  base: './',
  build: {
    // Inline CSS is off by default; Astro bundles CSS into separate files
  },
});
