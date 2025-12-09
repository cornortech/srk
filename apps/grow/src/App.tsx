import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GrowOnlyAdminDashboard } from './pages/admin-dashboard/page';
import { GrowLandingPage } from './pages/landing-page/page';
import { GrowDashboard } from './pages/user-dashboard/page';
import { GrowVerificationPage } from './pages/grow-verification/page';
import Callback from './pages/sso-callback/page';
import SocialMediaGrow from './pages/socialmedia-grow/page';
import { LoginPage } from './pages/user-login/page';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <GrowLandingPage />,
  },
  {
    path: '/callback',
    element: <Callback />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/grow/verification',
    element: <GrowVerificationPage />,
  },
  {
    path: '/socialmedia-grow',
    element: <SocialMediaGrow />,
  },
  {
    path: '/admin/dashboard',
    element: <GrowOnlyAdminDashboard />,
  },
  {
    path: '/affilate/dashboard',
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
