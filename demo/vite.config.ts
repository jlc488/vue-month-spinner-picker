import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  root: __dirname,
  base: '/vue-month-spinner-picker/',
  build: {
    outDir: '../demo-dist',
    emptyOutDir: true,
  },
  server: {
    port: 3333,
    open: true,
  },
});
