import axios from 'axios';
import { baseURL, browserURL } from '../config.json';
import { isBrowser } from './platform';

export const instance = axios.create({
  baseURL: isBrowser() ? browserURL : baseURL,
  // headers: {
  //   origin: baseURL,
  // },
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
