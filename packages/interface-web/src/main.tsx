import '@ant-design/v5-patch-for-react-19';
import './configuration-modification';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'dayjs/locale/zh-cn';
import { App } from 'antd';
import '@/assets/styles/converge.less';
import 'virtual:uno.css';
// import { setAxiosConfiguration } from 'core';
// import config from 'core/config.json';
import { RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { createHashHistory, createRouter } from '@tanstack/react-router';
import { Theme } from '@/components/theme/theme';

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// // 如果浏览器环境下
// if (!IS_ELECTRON) {
//   setAxiosConfiguration((axiosConfig) => {
//     // 生产环境下不使用代理
//     axiosConfig.baseURL = import.meta.env.DEV
//       ? config.browserConfiguration.baseURL
//       : config.nodeConfiguration.baseURL;

//     axiosConfig.headers ||= {};
//     axiosConfig.headers['origin'] = undefined;
//   });
// }

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Theme>
        <App>
          <RouterProvider router={router} />
        </App>
      </Theme>
    </React.StrictMode>,
  );
}
