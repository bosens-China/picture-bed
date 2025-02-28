import { defaultAxiosConfig } from 'core';
import { nodeConfiguration } from 'core/config.json';

// 生产环境下，把路径修订下
if (import.meta.env.PROD) {
  Object.assign(defaultAxiosConfig, nodeConfiguration);
}
