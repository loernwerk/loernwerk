import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: {
        include: ['tests/component/**/*.test.ts', 'tests/views/**/*.test.ts'],
        setupFiles: ['tests/component/translation_mock.setup.ts', 'tests/component/router_mock.setup.ts'],
        globals: true,
        environment: 'jsdom',
        watch: false,
    },
});