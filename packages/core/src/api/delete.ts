import { request } from '../utils/request';

export interface ImgDeleteParameters {
  uid: string;
  id: string;
}

/**
 * 删除资源文件
 * @param body
 * @returns
 */
export const imgDelete = async (body: ImgDeleteParameters) => {
  const { uid, id } = body;
  const { data } = await request<boolean>({
    url: `/img/delete`,
    method: 'delete',
    params: {
      uid,
      id,
    },
  });
  return data;
};
