/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import type { upload, UploadBody, UploadReturnStructure } from './api/upload';
import type {
  browserUpload,
  RealBody,
  UploadBodyBrowser,
} from './api/upload-browser';
import {
  getRandomInt,
  runParallel,
  RunParallelProps,
  RunParallelReturn,
} from './utils/speedLimiter';

export { default as config } from './config.json';

export type UploadProgress = (
  progressEvent: AxiosProgressEvent,
  body: RealBody,
) => void;

/**
 * 消息回调
 */
export type MessageCallback<T extends UploadBody | UploadBodyBrowser> = (e: {
  index: number;
  total: number;
  data?: UploadReturnStructure;
  err?: AxiosError;
  item: T;
}) => void;

export type UploadFilesBody<T extends UploadBody | UploadBodyBrowser> = {
  config?: Partial<Omit<RunParallelProps<unknown, unknown>, 'iteratorFn'>> & {
    messageCallback?: MessageCallback<T>;
    onUploadProgress?: UploadProgress;
  };
  files: T[];
};

/**
 * 上传文件
 *
 * @param {UploadFilesBody} { files, config }
 * @return {*}
 */
export async function uploadFiles(
  fn: typeof upload,
  { files, config }: UploadFilesBody<UploadBody>,
): RunParallelReturn<UploadReturnStructure>;
export async function uploadFiles(
  fn: typeof browserUpload,
  { files, config }: UploadFilesBody<UploadBodyBrowser>,
): RunParallelReturn<UploadReturnStructure>;
export async function uploadFiles(
  fn: typeof upload | typeof browserUpload,
  { files, config }: UploadFilesBody<any>,
): RunParallelReturn<UploadReturnStructure> {
  const {
    maxConcurrency = 4,
    waitingTime = getRandomInt(0, 1000),
    messageCallback,
  } = config || {};
  const result = await runParallel(files, {
    iteratorFn(item, index, total) {
      return fn(item, config)
        .then((res) => {
          messageCallback?.({ index, total, data: res, item });
          return res;
        })
        .catch((e: AxiosError) => {
          messageCallback?.({ index, total, err: e, item });
          return Promise.reject(e);
        });
    },
    maxConcurrency,
    waitingTime,
  });
  return result;
}

export const defaultConfig: AxiosRequestConfig<unknown> = {};

/**
 * 全局修改axios配置，会影响到所有的api相关接口
 *
 * @param fn
 */
export const setAxiosConfiguration = (
  fn: (config: typeof defaultConfig) => void,
) => {
  fn(defaultConfig);
};
