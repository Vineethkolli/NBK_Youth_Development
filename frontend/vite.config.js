import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    host: true, // Enables access from other devices
    port: 5173, // Change if needed
    strictPort: true, // Prevents Vite from switching ports automatically
  },
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest', 
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      manifest: {
        name: 'NBK Youth',
        short_name: 'NBK Youth',
        description: 'NBK Youth Gangavaram',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://nbkyouth.vercel.app',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
          {
            urlPattern: ({ url }) => url.origin === location.origin,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
            },
          },
        ],
      },
    }),
  ],
});