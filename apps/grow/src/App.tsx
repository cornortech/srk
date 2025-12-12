import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GrowLandingPage } from './pages/LandingPage';
import CallbackPage from './pages/CallbackPage';
import { LoginPage } from './pages/LoginPage';
import { GrowVerificationPage } from './pages/VerificationPage';
import SocialMediaGrow from './pages/SocialMediaPage';
import { GrowOnlyAdminDashboard } from './pages/GrowAdminDashboard';
import { GrowDashboard } from './pages/GrowDashboard';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <GrowLandingPage />,
  },
    {
    path: "/landing/:section",
    element: <GrowLandingPage />,
  },
  {
    path: '/callback',
    element: <CallbackPage />,
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
