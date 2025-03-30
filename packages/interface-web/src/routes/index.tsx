/* eslint-disable check-file/no-index */
import { useGroupingStore } from '@/store/grouping';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const groups = useGroupingStore((state) => state.groups);
  const navigate = useNavigate();

  useEffect(() => {
    if (groups.length) {
      navigate({
        to: `/${groups.at(0)?.id}`,
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
