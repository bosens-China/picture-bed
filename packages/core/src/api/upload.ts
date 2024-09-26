// import { AxiosError } from 'axios';
import { instance } from '../utils/request';
import { fileFromPath } from 'formdata-node/file-from-path';

/**
 * 上传接口所需参数
 *
 * @export
 * @interface UploadBody
 */
export interface UploadBody {
  /**
   * 文件名称，可选
   * 如果为空则使用file或者使用filePath的名称
   *
   * @type {string}
   * @memberof UploadBody
   */
  fileName?: string;
  /**
   * 上传的文件，node环境下可以使用filePath
   * 但是它和filePath必须存在一个
   *
   * @type {File}
   * @memberof UploadBody
   */
  file?: File;
  /**
   * node环境下使用，上传的file文件地址
   *
   * @type {string}
   * @memberof UploadBody
   */
  filePath?: string;
  /**
   * 用户身份标识，用于区分身份所使用
   *
   * @type {string}
   * @memberof UploadBody
   */
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

export async function upload(body: UploadBody) {
  if ([body.file, body.filePath].every((f) => !f)) {
    throw new Error('file or filePath is required');
  }

  const file = body.file ?? (await fileFromPath(body.filePath!));
  const fileName = body.fileName ?? file.name;

  const { uid } = body;

  const form = new FormData();
  form.append('fileName', fileName);
  form.append('file', file);
  form.append('uid', uid);
  // try {
  const { data } = await instance.post<UploadReturnStructure>(
    `/img/upload`,
    form,
  );
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
}
