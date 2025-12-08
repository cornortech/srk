import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GrowOnlyAdminDashboard } from './pages/admin-dashboard/page';
import { GrowLandingPage } from './pages/landing-page/page';
import { GrowDashboard } from './pages/user-dashboard/page';
import { GrowVerificationPage } from './pages/grow-verification/page';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <GrowLandingPage />,
  },
  {
    path: '/grow/verification',
    element: <GrowVerificationPage />,
  },
  {
    path: '/admin/dashboard',
    element: <GrowOnlyAdminDashboard />,
  },
  {
    path: '/user/dashboard',
    element: <GrowDashboard />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
