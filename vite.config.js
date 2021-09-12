import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const pathSrc = path.resolve(__dirname, '/src');

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
});
