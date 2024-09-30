import { serialize, deserialize } from 'seroval';

const key = '_store';

export const setStore = (values: unknown) => {
  window.localStorage.setItem(key, serialize(values));
};
export const getStore = () => {
  return deserialize(window.localStorage.getItem(key) || '') || undefined;
};
