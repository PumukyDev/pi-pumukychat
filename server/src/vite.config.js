import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/main.css',
                'resources/css/light.css',
                'resources/css/dark.css',
                'resources/js/particles.js',
                'resources/js/check_scroll.js',
                'resources/js/keygen.js',
            ],
            refresh: true,
        }),
    ],
});
