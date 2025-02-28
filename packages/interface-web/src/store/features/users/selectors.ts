import { RootState } from '@/store/store';

/**
 * 分组的激活项
 *
 * @param {RootState} state
 * @return {*}
 */
export const activationItem = (state: RootState) => {
  const { selected, users } = state.users;

  return users.find((f) => f.key === selected);
};
