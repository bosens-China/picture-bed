import resso from '@/utils/resso';
import { serialize, deserialize } from 'seroval';

const key = '_store';

const setStore = (values: unknown) => {
  window.localStorage.setItem(key, serialize(values));
};
const getStore = () => {
  return (
    deserialize<Store>(window.localStorage.getItem(key) || '') || defaultStore
  );
};

export interface RootStore {
  user: Partial<{
    uid: string;
  }>;
}

const defaultStore: Store = {
  user: undefined,
};

export type Store = Partial<RootStore>;

export const store = resso<Store>(getStore());

resso.config({
  watch: (obj) => {
    setStore(obj.resso);
  },
});
