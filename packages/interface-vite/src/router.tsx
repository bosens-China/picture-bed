import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layout/layout';
import { UploadPreview } from '@/pages/upload-preview/page';
import { Empty } from '@/pages/empty/page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout></AppLayout>,
    children: [
      {
        path: '',
        element: <Empty></Empty>,
      },
      {
        path: ':id',
        element: <UploadPreview></UploadPreview>,
      },
    ],
  },
]);

export const Router = () => <RouterProvider router={router} />;
