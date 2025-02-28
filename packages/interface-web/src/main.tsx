import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import ReactDOM from 'react-dom/client';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { App, ConfigProvider } from 'antd';
import '@/assets/styles/converge.less';
import 'virtual:uno.css';
import { setAxiosConfiguration } from 'core';
import config from 'core/config.json';
import { RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { createHashHistory, createRouter } from '@tanstack/react-router';

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// 如果浏览器环境下
if (!IS_ELECTRON) {
  setAxiosConfiguration((axiosConfig) => {
    // 生产环境下不使用代理
    axiosConfig.baseURL = import.meta.env.DEV
      ? config.browserConfiguration.baseURL
      : config.nodeConfiguration.baseURL;

    axiosConfig.headers ||= {};
    axiosConfig.headers['origin'] = undefined;
  });
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ConfigProvider
        locale={zhCN}
        theme={{
          cssVar: true,
          token: {
            colorPrimary: `#2563EB`,
            borderRadiusOuter: 8,
          },
          components: {
            Layout: {
              headerBg: '#fff',
              //     headerPadding: 0,
              //     footerPadding: 0,
              siderBg: '#fff',
              colorBgLayout: '#fff',
            },
            Menu: {
              activeBarBorderWidth: 0,
            },
            //   Card: {
            //     paddingLG: 12,
            //   },
          },
        }}
      >
        <App>
          <RouterProvider router={router} />
        </App>
      </ConfigProvider>
    </React.StrictMode>,
  );
}
