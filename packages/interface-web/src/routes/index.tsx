import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: () => {
    return redirect({
      to: '/grouping',
    });
  },
});

function RouteComponent() {
  return null;
}
