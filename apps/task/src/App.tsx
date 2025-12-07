import { useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Callback from './pages/Callback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { useTaskAuthStore } from './store/useTaskAuthStore';
import { apiClient } from './lib/apiClient';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
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
    element: <Dashboard />,
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
        // Type-safe API call using ts-rest client
        const response = await apiClient.getMe();
        if (response.status === 200 && response.body.success && response.body.user) {
          setUser(response.body.user);
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