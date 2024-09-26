import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import UnoCSS from 'unocss/vite';
import { createRequire } from 'module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { browserURL, baseURL } = require(
  path.join(require.resolve('core'), '../config.json'),
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 4444,
    proxy: {
      [browserURL]: {
        target: baseURL,
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(browserURL, '');
        },
        headers: {
          origin: baseURL,
        },
      },
    },
  },
});
