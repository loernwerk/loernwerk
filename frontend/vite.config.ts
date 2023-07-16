import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['h5p-editor', 'h5p-player'].includes(tag),
        },
      },
    }),
  ],
  build: {
    outDir: '../build/dist/',
  },
  server: {
    port: 5173,
  },
});
