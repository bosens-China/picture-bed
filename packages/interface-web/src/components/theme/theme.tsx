import { ConfigProvider, theme as themeRoot } from 'antd';
import { FC, useEffect } from 'react';
import zhCN from 'antd/locale/zh_CN';
import { useThemetStore } from '@/store/theme';

export const Theme: FC<React.PropsWithChildren> = ({ children }) => {
  const { theme } = useThemetStore();

  // html[data-theme=dark]
  const bgColor = theme === 'dark' ? '#141517' : '#fff';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          theme === 'dark'
            ? themeRoot.darkAlgorithm
            : themeRoot.defaultAlgorithm,
        cssVar: true,
        token: {
          colorPrimary: `#2563EB`,
          borderRadiusOuter: 8,
          colorBgBase: theme === 'dark' ? '#fff' : undefined,
        },
        components: {
          Layout: {
            headerBg: bgColor,
            //     headerPadding: 0,
            //     footerPadding: 0,
            siderBg: bgColor,
            colorBgLayout: bgColor,
          },
          Menu: {
            activeBarBorderWidth: 0,
            itemBg: bgColor,
            colorText: theme === 'dark' ? '#9CA3AF' : `#4B5563`,
            itemActiveBg: theme === 'dark' ? '#141517' : `#EFF6FF`,
            itemSelectedColor: theme === 'dark' ? '#fff' : `#2563EB`,
          },
          Button: {
            defaultBg: theme === 'dark' ? '#141517' : undefined,
            defaultBorderColor: theme === 'dark' ? 'transparent' : `#D1D5DB`,
            defaultShadow: theme === 'dark' ? 'none' : undefined,
          },
          //   Card: {
          //     paddingLG: 12,
          //   },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
