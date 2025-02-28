import { useProjectStore } from '@/store/project';
import { defaultFingerprint } from '@/utils/fingerprint';
import { useAsyncEffect } from 'ahooks';

/*
 * 初始化的时候给一个值
 */
let isEmpty = localStorage.getItem('project-storage') === null;

export const useProject = () => {
  const projects = useProjectStore((state) => state.projects);
  const addProject = useProjectStore((state) => state.addProject);
  const setCurrent = useProjectStore((state) => state.setCurrent);
  const current = useProjectStore((state) => state.current);

  useAsyncEffect(async () => {
    if (!isEmpty) {
      return;
    }
    isEmpty = false;

    const res = await defaultFingerprint();
    addProject({
      id: res.visitorId,
      total: 0,
      title: '默认项目',
    });
  }, []);

  return {
    projects,
    current,
    setCurrent,
    addProject,
  };
};
