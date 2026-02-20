import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueMonthSpinnerPicker',
      fileName: (format) => {
        if (format === 'es') return 'vue-month-spinner-picker.es.js';
        if (format === 'cjs') return 'vue-month-spinner-picker.cjs.js';
        return `vue-month-spinner-picker.${format}.js`;
      },
      formats: ['es', 'cjs'],
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
    cssCodeSplit: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
