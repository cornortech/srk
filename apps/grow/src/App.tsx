import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GrowOnlyAdminDashboard } from './pages/admin-dashboard/page';
import { GrowLandingPage } from './pages/landing-page/page';
import { GrowDashboard } from './pages/user-dashboard/page';
import { GrowVerificationPage } from './pages/grow-verification/page';
import useGrowAuthStore from './store/useGrowAuthStore';
import { useEffect } from 'react';
import { getMe } from '@srk/shared/api';
import { env } from './lib/env';
import Callback from './pages/callback/page';
import ProtectedRoute from './components/ProtectedRoute';

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
    path: '/grow/verification',
    element: <ProtectedRoute><GrowVerificationPage /></ProtectedRoute>,
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute><GrowOnlyAdminDashboard /></ProtectedRoute>,
  },
  {
    path: '/user/dashboard',
    element: <ProtectedRoute><GrowDashboard /></ProtectedRoute>,
  }
]);

// Auth initializer component
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setLoading } = useGrowAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe(env.backendUrl);
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Not authenticated');
        setUser(null);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;