import { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useProjectStore } from '@/store/project';

export const useInspect = () => {
  const { current, projects, setCurrent } = useProjectStore();
  const navigate = useNavigate();
  const { href } = useLocation();
  // 全局唯一副作用
  useEffect(() => {
    // 项目选择逻辑
    if (
      !current ||
      (!projects.find((f) => f.id === current) && projects.length)
    ) {
      setCurrent(projects.at(0)?.id ?? null);
    }
    if (current && !projects.length) {
      setCurrent(null);
    }
    const to = current ? `/${current}` : '/';
    if (to === href) {
      return;
    }
    // 路由跳转逻辑
    navigate({ to });
  }, [current, projects, setCurrent, navigate]);
};
