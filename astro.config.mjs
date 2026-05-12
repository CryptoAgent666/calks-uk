// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://calks.uk',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      // Exclude pages that shouldn't be indexed: search endpoint, PWA offline fallback, 404
      filter: (page) =>
        !page.includes('/offline/') &&
        !page.includes('/search/') &&
        !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
});
