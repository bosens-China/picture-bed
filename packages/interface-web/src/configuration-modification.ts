import { request } from '@boses/picture-bed-sdk';

// 开发环境下，把路径修订下
if (import.meta.env.DEV) {
  request.interceptors.request.use((config) => {
    config.baseURL = `/api`;
    return config;
  });
}
