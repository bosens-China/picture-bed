import { defineConfig, presetUno, presetIcons } from 'unocss';
import { themePreset } from './plugins/theme-preset';

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  },
  presets: [
    presetUno(),
    presetIcons(),
    themePreset({
      title: {
        light: '#111827',
        dark: `#fff`,
      },
      borderColor: {
        light: '#E5E7EB',
        dark: '#2C2E33',
      },
      // 描述文字
      desc: {
        light: '#4B5563',
        dark: '#9CA3AF',
      },
      // 次级文本
      secondary: {
        light: '#6B7280',
        dark: '#9CA3AF',
      },
      cardBg: {
        light: '#fff',
        dark: '#25262B',
      },
    }),
  ],
});
