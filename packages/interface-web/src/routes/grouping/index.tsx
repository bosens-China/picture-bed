import { useGroupingStore } from '@/store/grouping';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Empty } from '../_components/empty';

export const Route = createFileRoute('/grouping/')({
  component: RouteComponent,
  loader() {
    const { groups } = useGroupingStore.getState();
    if (groups.length) {
      return redirect({
        to: `/grouping/$id`,
        params: {
          id: groups[0].id,
        },
      });
    }
  },
});

function RouteComponent() {
  return <Empty type={'projects'}></Empty>;
}
