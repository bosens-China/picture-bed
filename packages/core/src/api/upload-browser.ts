import { instance } from '../utils/request';
import { type UploadFilesBody, defaultAxiosConfig } from '../main';
import type { UploadBody, UploadReturnStructure } from './upload';

/**
 * 上传接口所需参数
 *
 * @export
 * @interface UploadBodyBrowser
 */
export interface UploadBodyBrowser {
  /**
   * 文件名称，可选
   * 如果为空则使用file或者使用filePath的名称
   *
   * @type {string}
   * @memberof UploadBodyBrowser
   */
  fileName?: string;
  /**
   * 上传的文件
   *
   * @type {File}
   * @memberof UploadBodyBrowser
   */
  file: File;
  /**
   * 用户身份标识，用于区分身份所使用
   *
   * @type {string}
   * @memberof UploadBodyBrowser
   */
  uid: string;
}

export type RealBody = Required<UploadBodyBrowser>;

/**
 * 浏览器上传文件方法
 * @param body
 * @param config
 * @returns
 */
export async function browserUpload(
  body: UploadBodyBrowser,
  config?: UploadFilesBody<UploadBodyBrowser>['config'],
) {
  const file = body.file;
  const fileName = body.fileName ?? file.name;
  const { uid } = body;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return realUpload({ file, fileName, uid }, config as any);
}

export const realUpload = async (
  body: RealBody,
  config?: UploadFilesBody<UploadBodyBrowser | UploadBody>['config'],
) => {
  const { file, fileName, uid } = body;
  const form = new FormData();
  form.append('fileName', fileName);
  form.append('file', file);
  form.append('uid', uid);
  const { onUploadProgress } = config || {};
  const { data } = await instance<UploadReturnStructure>({
    url: `/img/upload`,
    ...defaultAxiosConfig,
    method: 'post',
    data: form,
    onUploadProgress(progressEvent) {
      onUploadProgress?.(progressEvent, body);
    },
  });
  return data;
  // } catch (e) {
  //   if (e instanceof AxiosError) {
  //     throw {
  //       message: e.message,
  //       data: e.response?.data,
  //       status: e.response?.status,
  //       statusText: e.response?.statusText,
  //       config: e.config,
  //     };
  //   }
  //   throw e;
  // }
};
