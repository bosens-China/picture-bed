import { useAppSelector } from '@/store/hooks';
import { useEffect, useMemo, useState } from 'react';

/**
 * 返回当前系统默认的主题是什么
 */
export const useThemeDefault = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  return theme;
};

/*
 * 返回当前系统的主题
 */
export const useTheme = () => {
  const { theme } = useAppSelector((state) => state.users);
  const themeDefault = useThemeDefault();

  return useMemo(() => {
    switch (theme?.theme) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      default:
        return themeDefault;
    }
  }, [theme?.theme, themeDefault]);
};
