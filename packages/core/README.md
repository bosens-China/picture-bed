# @boses/picture-bed-sdk

图床 sdk 服务，支持浏览器和服务器调用。

在下面阅读之前，请确保已经安装

```sh
pnpm intall @boses/picture-bed-sdk
```

## 浏览器调用

**1. 修改 vite.config.ts 文件**

```ts
    server: {
      port: 4444,
      proxy: {
        '/api': {
          target: `https://playground.z.wiki`,
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(`/api`, '');
          },
          headers: {
            origin: `https://playground.z.wiki`,
          },
        },
      },
    },
```

**2. 修改请求**

main.ts

```ts
import { request } from '@boses/picture-bed-sdk';

// 开发环境下，把路径修订下
if (import.meta.env.DEV) {
  request.interceptors.request.use((config) => {
    config.baseURL = `/api`;
    return config;
  });
}
```

## Node

默认情况下直接调用就可以，但是如果涉及到本地的 File 文件上传，则看下面示例

```ts
import { upload } from '@boses/picture-bed-sdk';
import { fileFromPath } from 'formdata-node/file-from-path';

const file = await fileFromPath('xxx');
upload({
  file: file as unknown as File,
  uid: 'yliu',
});
```
