// /* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateAxiosDefaults } from 'axios';
// import type { upload, UploadBody, UploadReturnStructure } from './api/upload';
// import type {
//   browserUpload,
//   RealBody,
//   UploadBodyBrowser,
// } from './api/upload-browser';
// import {
//   runParallel,
//   RunParallelProps,
//   RunParallelReturn,
// } from './utils/speedLimiter';

import { browserProxy } from './config.json';

// export type UploadProgress = (
//   progressEvent: AxiosProgressEvent,
//   body: RealBody,
// ) => void;

// type Constraint = UploadBody | UploadBodyBrowser;

// /**
//  * 消息回调
//  */
// export type MessageCallback<T extends Constraint> = (e: {
//   index: number;
//   total: number;
//   data?: UploadReturnStructure;
//   err?: AxiosError;
//   item: T;
// }) => void;

// export type Config<T extends UploadBody | UploadBodyBrowser> = Partial<
//   Omit<RunParallelProps<unknown, unknown>, 'iteratorFn'>
// > & {
//   messageCallback?: MessageCallback<T>;
//   onUploadProgress?: UploadProgress;
// };

// export type UploadFilesBody<T extends UploadBody | UploadBodyBrowser> = {
//   config?: Config<T>;
//   files: T[];
// };

// /**
//  * 配置项的默认填充值，后续暴露给平台的设置值使用，充当默认值
//  */
// export const defaultConfig: Required<Config<Constraint>> = {
//   maxConcurrency: 4,
//   waitingTime: [0, 1000],
//   messageCallback: () => {},
//   onUploadProgress: () => {},
// };

// /**
//  * 上传文件
//  *
//  * @param {UploadFilesBody} { files, config }
//  * @return {*}
//  */
// export async function uploadFiles(
//   fn: typeof upload,
//   { files, config }: UploadFilesBody<UploadBody>,
// ): RunParallelReturn<UploadReturnStructure>;
// export async function uploadFiles(
//   fn: typeof browserUpload,
//   { files, config }: UploadFilesBody<UploadBodyBrowser>,
// ): RunParallelReturn<UploadReturnStructure>;
// export async function uploadFiles(
//   fn: typeof upload | typeof browserUpload,
//   { files, config }: UploadFilesBody<any>,
// ): RunParallelReturn<UploadReturnStructure> {
//   const {
//     maxConcurrency = defaultConfig.maxConcurrency,
//     waitingTime = defaultConfig.waitingTime,
//     messageCallback,
//   } = config || {};
//   const result = await runParallel(files, {
//     iteratorFn(item, index, total) {
//       return fn(item, config)
//         .then((res) => {
//           messageCallback?.({ index, total, data: res, item });
//           return res;
//         })
//         .catch((e: AxiosError) => {
//           messageCallback?.({ index, total, err: e, item });
//           return Promise.reject(e);
//         });
//     },
//     maxConcurrency,
//     waitingTime,
//   });
//   return result;
// }

export const defaultAxiosConfig: Pick<
  CreateAxiosDefaults<unknown>,
  'baseURL' | 'headers'
> = {
  ...browserProxy,
};

// /**
//  * 全局修改axios配置，会影响到所有的api相关接口
//  *
//  * @param fn
//  */
// export const setAxiosConfiguration = (
//   fn: (config: typeof defaultAxiosConfig) => void,
// ) => {
//   fn(defaultAxiosConfig);
// };
