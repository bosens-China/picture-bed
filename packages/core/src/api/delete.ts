import { instance } from '../utils/request';
import { defaultAxiosConfig } from '../main';

export interface RequestParameters {
  uid: string;
  id: string;
}

/**
 * 删除资源文件
 * @param body
 * @returns
 */
export const imgDelete = async (body: RequestParameters) => {
  const { uid, id } = body;
  const { data } = await instance<boolean>({
    url: `/img/delete`,
    ...defaultAxiosConfig,
    method: 'delete',
    params: {
      uid,
      id,
    },
  });
  return data;
};
