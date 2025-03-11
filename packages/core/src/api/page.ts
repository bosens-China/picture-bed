// https://playground.z.wiki/

import { obtainOrigin } from 'src/utils/obtain';
import { request } from '../utils/request';

export interface ImgHistoryParameters {
  uid: string;

  current?: number;
  pageSize?: number;
}

export interface ImgHistoryResponse {
  page: number;
  total: number;
  data: Daum[];
}

interface Daum {
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
 * 上传的格式，符合https://ahooks.js.org/zh-CN/hooks/use-pagination 要求
 *
 * @param {ImgHistoryParameters} body
 * @return {*}
 */
export const imgHistory = async (body: ImgHistoryParameters) => {
  const { uid, current = 1, pageSize = 10 } = body;
  const { data } = await request<ImgHistoryResponse>({
    url: `/img/history`,
    method: 'get',
    params: {
      uid,
      page: current,
      pageSize,
    },
  });

  const { page, total, data: list } = data;
  const newdata = list.map((item) => {
    return obtainOrigin(item);
  });

  return {
    page,
    total,
    list: newdata,
  };
};
