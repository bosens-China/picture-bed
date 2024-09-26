import { upload, UploadBody } from './api/upload';
import {
  getRandomInt,
  runParallel,
  RunParallelProps,
} from './utils/speedLimiter';

export { default as config } from './config.json';

export type UploadFilesBody = {
  config?: Partial<RunParallelProps<unknown, unknown>>;
  files: UploadBody[];
};

export const _baseURL = Symbol();

/**
 * 上传文件
 *
 * @param {UploadFilesBody} { files, config }
 * @return {*}
 */
export const uploadFiles = async ({ files, config }: UploadFilesBody) => {
  const { maxConcurrency = 4, waitingTime = getRandomInt(0, 1000) } =
    config || {};
  const result = await runParallel(files, {
    iteratorFn(item, ...rest) {
      config?.iteratorFn?.(item, ...rest);
      return upload(item);
    },
    maxConcurrency,
    waitingTime,
  });
  return result;
};
