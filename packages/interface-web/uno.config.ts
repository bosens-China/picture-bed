import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  content: {
    filesystem: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  },
  presets: [presetUno(), presetIcons()],
});
