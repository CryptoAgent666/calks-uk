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
      // Add lastmod (current build time) and per-page-type priority/changefreq
      serialize: (item) => {
        const url = item.url
        // Default: today's date in YYYY-MM-DD
        item.lastmod = new Date().toISOString()
        // Priority by page type
        if (url === 'https://calks.uk/') {
          item.priority = 1.0
          item.changefreq = 'daily'
        } else if (url.includes('/calculator/')) {
          item.priority = 0.8
          item.changefreq = 'monthly'
        } else if (url.includes('/category/') || url === 'https://calks.uk/calculators/') {
          item.priority = 0.9
          item.changefreq = 'weekly'
        } else if (url.includes('/about/') || url.includes('/methodology/')) {
          item.priority = 0.6
          item.changefreq = 'monthly'
        } else {
          item.priority = 0.5
          item.changefreq = 'monthly'
        }
        return item
      },
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
