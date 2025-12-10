import '../styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Callback from '../pages/auth/callback/page';
import Dashboard from '../pages/dashboard/main/Dashboard';
import Login from '../pages/auth/login/page';
import { TaskLandingPage } from '../pages/landing/page';
import { TaskVerificationPage } from '../pages/tasks/verification/page';
import AuthInitializer from '../components/auth/AuthInitializer';
import AfterVerified from '../pages/dashboard/afterVerified/page';

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
    path: '/task/verification',
    element: <TaskVerificationPage />,
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
