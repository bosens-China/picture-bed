import axios from 'axios';
import { defaultAxiosConfig } from '../main';

export const instance = axios.create({
  ...defaultAxiosConfig,
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    try {
      const msg = error.response.data.message;
      error.message = msg;
    } catch {
      //
    }
    return Promise.reject(error);
  },
);
