import axios from 'axios';

export const request = axios.create({
  baseURL: `https://playground.z.wiki`,
});

request.interceptors.response.use(
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
