import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        include: ['tests/component/**.test.ts'],
        globals: true,
        environment: 'happy-dom',
        watch: false,
    },
});