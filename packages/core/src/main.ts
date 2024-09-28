import { AxiosError, AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { upload, UploadBody, UploadReturnStructure } from './api/upload';
import {
  getRandomInt,
  runParallel,
  RunParallelProps,
} from './utils/speedLimiter';

export { default as config } from './config.json';

export type axiosConfig = Omit<
  AxiosRequestConfig<unknown>,
  'onUploadProgress'
> & {
  onUploadProgress: (
    progressEvent: AxiosProgressEvent,
    body: UploadBody,
  ) => void;
};

/**
 * 消息回调
 */
export type MessageCallback = (e: {
  index: number;
  total: number;
  data?: UploadReturnStructure;
  err?: AxiosError;
  item: UploadBody;
}) => void;

export type UploadFilesBody = {
  config?: Partial<Omit<RunParallelProps<unknown, unknown>, 'iteratorFn'>> & {
    messageCallback?: MessageCallback;
  };
  files: UploadBody[];
  axiosConfig?: axiosConfig;
};

export const _baseURL = Symbol();

/**
 * 上传文件
 *
 * @param {UploadFilesBody} { files, config }
 * @return {*}
 */
export const uploadFiles = async ({
  files,
  config,
  axiosConfig,
}: UploadFilesBody) => {
  const { maxConcurrency = 4, waitingTime = getRandomInt(0, 1000) } =
    config || {};
  const result = await runParallel(files, {
    iteratorFn(item, index, total) {
      return upload(item, axiosConfig)
        .then((res) => {
          config?.messageCallback?.({ index, total, data: res, item });
          return res;
        })
        .catch((e) => {
          config?.messageCallback?.({ index, total, err: e, item });
          return Promise.reject(e);
        });
    },
    maxConcurrency,
    waitingTime,
  });
  return result;
};
