/// <reference types="vitest" />

import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import path from 'path';

const pathSrc = path.resolve(__dirname, '/src');

export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup-file.ts'],
  },
});
