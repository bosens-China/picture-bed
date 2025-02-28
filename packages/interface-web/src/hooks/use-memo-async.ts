/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export const useMemoAsync = <T>(
  fn: () => Promise<T>,
  effect: Array<unknown>,
) => {
  const [value, setValue] = useState<T | undefined>();

  useEffect(() => {
    fn().then(setValue);
  }, effect);

  return value;
};
