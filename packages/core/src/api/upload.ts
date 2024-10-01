// import { AxiosError } from 'axios';
import { fileFromPath } from 'formdata-node/file-from-path';
import { realUpload } from './upload-browser';
import { UploadFilesBody } from '../main';

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
   * node环境下使用，上传的file文件地址
   *
   * @type {string}
   * @memberof UploadBody
   */
  filePath: string;
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

/**
 * node 上传文件方法
 * @param body
 * @param config
 * @returns
 */
export async function upload(
  body: UploadBody,
  config?: UploadFilesBody<UploadBody>['config'],
) {
  const file = (await fileFromPath(body.filePath!)) as unknown as File;
  const fileName = body.fileName ?? file.name;

  const { uid } = body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return realUpload({ file, fileName, uid }, config as any);
}
