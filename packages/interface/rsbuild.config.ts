import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';

export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  html: {
    title: `图床资源管理`,
    favicon: './src/assets/CatppuccinFolderImagesOpen.svg',
  },
  dev: {
    hmr: false,
  },
});
