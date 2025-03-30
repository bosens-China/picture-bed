import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import UnoCSS from 'unocss/vite';
import { dependencies } from './package.json';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import svgr from 'vite-plugin-svgr';
import { codeInspectorPlugin } from 'code-inspector-plugin';

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
    plugins: [
      TanStackRouterVite({
        autoCodeSplitting: true,
        routeFileIgnorePattern: `.((css|const).ts)|_components|hooks`,
      }),
      codeInspectorPlugin({
        bundler: 'vite',
      }),
      svgr({}),
      react({
        babel: {
          plugins: [
            [
              'babel-plugin-react-compiler',
              {
                target: '19',
              },
            ],
          ],
        },
      }),
      UnoCSS(),
    ],
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
        '/api': {
          target: `https://playground.z.wiki`,
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(`/api`, '');
          },
          headers: {
            origin: `https://playground.z.wiki`,
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
                  !['@unocss', '@iconify-json', 'antd'].find((item) =>
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
