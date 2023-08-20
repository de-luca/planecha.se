/// <reference types="vitest" />

import { resolve, join } from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import Vue from '@vitejs/plugin-vue';

const pathSrc = resolve(__dirname, 'src');
const pathBoard = join(pathSrc, 'components', 'game', 'board');

export default defineConfig({
  plugins: [
    Vue(),
    VitePWA({
      base: '/',
      srcDir: 'src',
      includeAssets: 'cards/*',
      strategies: 'generateSW',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Planecha.se',
        short_name: 'Planecha.se',
        description: 'A Planechase companion app for people playing remotely (or locally)',
        theme_color: '#111111',
        orientation: 'landscape',
        display: 'standalone',
        icons: [
          {
            src: 'favicon/192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'favicon/512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'favicon/512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.*'],
      },
    }),
  ],
  resolve: {
    alias: {
      '#': pathSrc,
      '#board': pathBoard,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup-file.ts'],
    deps: {
      inline: [
        'simple-peer-light',
      ],
    },
  },
});
