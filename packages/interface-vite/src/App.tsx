import { ConfigProvider, theme as AppTheme } from 'antd';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import zhCN from 'antd/locale/zh_CN';
import { useTheme } from '@/hooks/useTheme';

export const App: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();
  const algorithm = useMemo(() => {
    switch (theme) {
      case 'dark':
        return AppTheme.darkAlgorithm;
      default:
        return AppTheme.defaultAlgorithm;
    }
  }, [theme]);

  useEffect(() => {
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (isMac) {
      return;
    }
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm,
        components: {
          Layout: {
            headerPadding: 0,
            footerPadding: 0,
            siderBg: '#fff',
          },
          Card: {
            paddingLG: 12,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
