import { useEffect } from 'react';
import * as _ from 'lodash-es';

/**
 * 将值写入到css变量中
 */
export const useCssVariables = (name: string, value: string) => {
  useEffect(() => {
    const debouncedSetProperty = _.debounce(() => {
      const root = document.querySelector(':root') as HTMLElement;
      root.style.setProperty(`${name}`, value);
    }, 10);

    debouncedSetProperty();

    return () => {
      debouncedSetProperty.cancel();
    };
  }, [name, value]);
};
