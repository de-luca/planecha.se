/// <reference types="vitest" />

import { resolve, join } from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';

const pathSrc = resolve(__dirname, 'src');
const pathBoard = join(pathSrc, 'components', 'game', 'board');

export default defineConfig({
  plugins: [Vue()],
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
        'trystero',
        'simple-peer-light',
      ],
    },
  },
});
