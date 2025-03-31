import { useGroupingStore } from '@/store/grouping';
import { defaultFingerprint } from '@/utils/fingerprint';
import { useAsyncEffect, useLocalStorageState } from 'ahooks';
import { useShallow } from 'zustand/shallow';
import { version } from '../../package.json';

/*
 * 初始化分组的时候，插入一个分组
 */
export const useInitializeGrouping = () => {
  const [initializeGrouping, setInitializeGrouping] = useLocalStorageState(
    `initializeGrouping_${version}`,
    {
      defaultValue: false,
    },
  );
  const { groups, addGroup } = useGroupingStore(
    useShallow((state) => {
      return {
        groups: state.groups,
        addGroup: state.addGroup,
      };
    }),
  );

  // 初始化检查，如果没有的话创建一个空的分组
  useAsyncEffect(async () => {
    if (groups.length || initializeGrouping) {
      return;
    }
    const uid = (await defaultFingerprint()).visitorId;
    addGroup({
      id: 'main',
      title: '默认分组',
      uid,
    });
    setInitializeGrouping(true);
  }, []);
};
