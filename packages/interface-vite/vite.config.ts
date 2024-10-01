import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import UnoCSS from 'unocss/vite';
import { createRequire } from 'module';
import path from 'node:path';
import type Config from 'core/config.json';
import { dependencies } from './package.json';

const require = createRequire(import.meta.url);
const config: typeof Config = require(
  path.join(require.resolve('core'), '../config.json'),
);
const { browserConfiguration, nodeConfiguration } = config;

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  let base = '/picture-bed/';
  if (command === 'serve') {
    base = '/';
  } else if (mode === 'electron') {
    base = '/';
  }

  return {
    base,
    plugins: [react(), UnoCSS()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      // 是否是 electron 环境
      IS_ELECTRON: mode === 'electron',
    },
    server: {
      port: 4444,
      proxy: {
        [browserConfiguration.baseURL]: {
          target: nodeConfiguration.baseURL,
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(browserConfiguration.baseURL, '');
          },
          headers: {
            origin: nodeConfiguration.baseURL,
          },
        },
      },
    },

    build: {
      rollupOptions: {
        output: {
          // 拆包，不要打成一个文件
          manualChunks: {
            ...Object.keys(dependencies)
              .filter(
                (f) =>
                  !['@unocss', '@iconify-json'].find((item) =>
                    f.startsWith(item),
                  ),
              )
              .reduce(
                (chunks, name) => {
                  chunks[name] = [name];
                  return chunks;
                },
                {} as Record<string, [string]>,
              ),
          },
        },
      },
    },
  };
});
