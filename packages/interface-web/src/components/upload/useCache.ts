interface Props {
  open: boolean;
}

import { useEffect, useMemo } from 'react';

export const useCache = ({ open }: Props) => {
  const map = useMemo(() => new Map<string, boolean>(), []);
  useEffect(() => {
    if (open) {
      map.clear();
    }
  }, [map, open]);
  return map;
};
