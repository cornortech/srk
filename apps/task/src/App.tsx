import { useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useTaskAuthStore } from './store/useTaskAuthStore';
import { getMe } from '@srk/shared/api';
import { env } from './lib/env';
import { TaskLandingPage } from './pages/page';
import AfterVerified from './pages/afterVerified/page';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <TaskLandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/callback',
    element: <Callback />,
  },
  {
    path: '/task/dashboard',
    element: <AfterVerified />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

// Auth initializer component
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setLoading } = useTaskAuthStore();

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