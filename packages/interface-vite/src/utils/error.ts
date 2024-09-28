import { AxiosError } from 'axios';

/*
 * 返回友好错误信息
 *
 */
export const getErrorMsg = (e: Error) => {
  const err = e as AxiosError;

  switch (err.code) {
    case 'ERR_NETWORK':
      return `网络错误访问错误，可能是cors问题也可能是服务端接口出现问题。`;

    default:
      return e.message;
  }
};
