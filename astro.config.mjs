// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import compressor from 'astro-compressor';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: node({
    mode: 'standalone'
  }),
  image: {
    // Enable image optimization
    domains: ['*'],
    remotePatterns: [{ protocol: 'https' }],
  },
  build: {
    // Inline stylesheets smaller than this limit (in bytes)
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  integrations: [
    // Compress static assets
    compressor({
      gzip: true,
      brotli: true
    })
  ],
  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 300 // 5 minutes
                }
              }
            }
          ]
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'ChipFindr - UK Fish & Chip Shop Directory',
          short_name: 'ChipFindr',
          description: 'Find the best fish and chip shops across the UK',
          theme_color: '#1e40af',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    build: {
      // Code splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
            search: ['./src/scripts/search.ts']
          }
        }
      }
    }
  }
});