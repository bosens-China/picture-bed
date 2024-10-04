import { ConfigProvider, theme as AppTheme } from 'antd';
import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
} from 'react';
import zhCN from 'antd/locale/zh_CN';
import { useTheme } from '@/hooks/useTheme';
import { EventEmitter, useEvent } from '@/hooks/use-event/use-event';

export const EventConent = createContext<null | EventEmitter<void>>(null);

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
    import('@/assets/styles/scrollbar.less');
  }, [theme]);

  const event = useEvent();

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
      <EventConent.Provider value={event}>{children}</EventConent.Provider>
    </ConfigProvider>
  );
};
