import axios from 'axios';
import { baseURL, browserURL } from '../config.json';
import { isBrowser } from './platform';

export const instance = axios.create({
  baseURL: isBrowser() ? browserURL : baseURL,
  // headers: {
  //   origin: baseURL,
  // },
});
