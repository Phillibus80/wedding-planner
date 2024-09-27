import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        stylelint({
            fix: true
        }),
        eslintPlugin({
            cache: false, // Disable caching to always show updated lint errors
            include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'], // Files to lint
            exclude: [/virtual:/, /node_modules/, /sb-preview/],
        })]
})
