import axios from 'axios';
import { nodeConfiguration } from '../config.json';

export const instance = axios.create({
  ...nodeConfiguration,
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
