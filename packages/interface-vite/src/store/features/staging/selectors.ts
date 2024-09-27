import { RootState } from '@/store/store';

/**
 * 工作台的激活项
 *
 * @param {RootState} state
 * @return {*}
 */
export const activationItem = (state: RootState) => {
  const { selected, staging } = state.staging;

  return staging.find((f) => f.key === selected);
};
