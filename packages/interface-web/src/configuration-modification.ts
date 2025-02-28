import { defaultAxiosConfig } from 'core';
import { browserConfiguration } from 'core/config.json';

// 生产环境下，把路径修订下
if (import.meta.env.PROD) {
  defaultAxiosConfig.baseURL = browserConfiguration.baseURL;
}
