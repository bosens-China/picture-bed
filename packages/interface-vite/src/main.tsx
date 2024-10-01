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

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App>
          <AppProvider>
            <Router></Router>
          </AppProvider>
        </App>
      </Provider>
    </React.StrictMode>,
  );
}
