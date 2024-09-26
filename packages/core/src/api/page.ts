// https://playground.z.wiki/

import { instance } from '../utils/request';

export interface RequestParameters {
  uid: string;
  page?: number;
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
 *
 * @param {RequestParameters} body
 * @return {*}
 */
export const imgHistory = async (body: RequestParameters) => {
  const { uid, page = 1, pageSize = 10 } = body;
  const { data } = await instance.get<ResponseParameters>(`/img/history`, {
    params: {
      uid,
      page,
      pageSize,
    },
  });

  return data;
};
