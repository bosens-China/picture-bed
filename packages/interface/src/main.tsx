import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { ConfigProvider } from 'antd';
import '@/assets/styles/converge.less';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ConfigProvider
        locale={zhCN}
        theme={{
          components: {
            Layout: {
              headerBg: '#fff',
              headerPadding: 0,
              footerPadding: 0,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </React.StrictMode>,
  );
}
