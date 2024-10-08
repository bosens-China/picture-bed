import React from 'react';
import ReactDOM from 'react-dom/client';
import 'dayjs/locale/zh-cn';
import '@/assets/styles/converge.less';
import 'virtual:uno.css';
import { App as AppProvider } from 'antd';
import { Router } from './router';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { setAxiosConfiguration } from 'core';
import config from 'core/config.json';
import { App } from './App';

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

if (typeof window !== 'undefined') {
  const rootEl = document.getElementById('root');
  const dom = (
    <React.StrictMode>
      <Provider store={store}>
        <App>
          <AppProvider>
            <Router />
          </AppProvider>
        </App>
      </Provider>
    </React.StrictMode>
  );
  if (import.meta.env.DEV) {
    const root = ReactDOM.createRoot(rootEl!);
    root.render(dom);
  } else {
    ReactDOM.hydrateRoot(rootEl!, dom);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function prerender(data: any) {
  const { renderToString } = await import('react-dom/server');
  const { parseLinks } = await import('vite-prerender-plugin/parse');
  const { StaticRouter } = await import('react-router-dom/server'); // 导入 StaticRouter

  const html = await renderToString(
    <StaticRouter location={data.url}>
      <App>
        <AppProvider>
          <Router />
        </AppProvider>
      </App>
    </StaticRouter>,
  );
  const links = parseLinks(html);

  return { html, links };
}
