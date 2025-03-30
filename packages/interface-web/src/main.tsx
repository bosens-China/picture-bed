import '@ant-design/v5-patch-for-react-19';
import './configuration-modification';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'dayjs/locale/zh-cn';
import { App } from 'antd';
import '@/assets/styles/converge.less';
import 'virtual:uno.css';
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
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme>
      <App>
        <RouterProvider router={router} />
      </App>
    </Theme>
  </React.StrictMode>,
);
