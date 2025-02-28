import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import { instance } from './request';

export type UploadProgress = (progressEvent: AxiosProgressEvent) => void;

export interface UserConfig {
  onUploadProgress: (
    progressEvent: AxiosProgressEvent,
    body: UploadConfig,
  ) => void;
}

export interface UploadConfig {
  fileName?: string;
  file: File;
  uid: string;
}
export interface UploadReturnStructure {
  id: number;
  fileName: string;
  time: string;
  url: string;
  uid: string;
  base64: string;
  contentType: string;
  shareCode: null | string;
  shareExpireDate: null | string;
  size: string;
  md5: string;
}

export interface UploadBrowserProps {
  userConfig?: Partial<UserConfig>;
  defaultAxiosConfig?: AxiosRequestConfig<unknown>;
}

export class UploadBrowser {
  constructor(public uploadBrowserConfig: UploadBrowserProps = {}) {}

  /**
   * 浏览器上传文件方法
   * @param body
   * @param config
   * @returns
   */
  browserUpload = async (body: UploadConfig) => {
    const { defaultAxiosConfig, userConfig } = this.uploadBrowserConfig;
    const { file, uid } = body;
    const fileName = body.fileName ?? file.name;
    const form = new FormData();
    form.append('fileName', fileName);
    form.append('file', file);
    form.append('uid', uid);
    const { onUploadProgress } = userConfig || {};
    const { data } = await instance<UploadReturnStructure>({
      ...defaultAxiosConfig,
      url: `/img/upload`,
      method: 'post',
      data: form,
      onUploadProgress(progressEvent) {
        onUploadProgress?.(progressEvent, body);
      },
    });
    return data;
  };
}
