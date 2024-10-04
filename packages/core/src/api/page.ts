// https://playground.z.wiki/

import { instance } from '../utils/request';
import { defaultAxiosConfig } from '../main';

export interface RequestParameters {
  uid: string;

  current?: number;
  pageSize?: number;
}

export interface ResponseParameters {
  page: number;
  total: number;
  data: Daum[];
}

export interface Daum {
  id: number;
  fileName: string;
  time: string;
  url: string;
  uid: string;
  base64: string | null;
  contentType: string;
  shareCode: string | null;
  shareExpireDate: string | null;
  size: string;
  md5: string | null;
}

/**
 * 获取已上传成功的文件列表
 * 上传的格式，符合https://ahooks.js.org/zh-CN/hooks/use-pagination要求
 *
 * @param {RequestParameters} body
 * @return {*}
 */
export const imgHistory = async (body: RequestParameters) => {
  const { uid, current = 1, pageSize = 10 } = body;
  const { data } = await instance<ResponseParameters>({
    url: `/img/history`,
    ...defaultAxiosConfig,
    method: 'get',
    params: {
      uid,
      page: current,
      pageSize,
    },
  });

  return {
    ...data,
    list: data.data,
  };
};
