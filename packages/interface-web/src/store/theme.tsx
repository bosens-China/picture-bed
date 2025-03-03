import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';

export type Theme = `dark` | `light`;

export interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemetStore = create(
  persist<ThemeStore>(
    (set) => ({
      theme: 'light',
      setTheme: (theme: Theme) =>
        set(
          produce((state: ThemeStore) => {
            state.theme = theme;
          }),
        ),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
