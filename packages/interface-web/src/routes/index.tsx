/* eslint-disable check-file/no-index */
import { useProjectStore } from '@/store/project';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const projects = useProjectStore((state) => state.projects);
  const navigate = useNavigate();

  useEffect(() => {
    if (projects.length) {
      navigate({
        to: `/${projects.at(0)?.id}`,
      });
      return;
    }
    navigate({
      to: `/$id`,
      params: { id: `null` },
    });
  }, []);

  return null;
}
