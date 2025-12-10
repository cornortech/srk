import '../styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Callback } from '../pages/auth/Callback';
import { Dashboard } from '../pages/dashboard/MainDashboard';
import { Login } from '../pages/auth/Login';
import { TaskLandingPage } from '../pages/landing/LandingPage';
import { TaskVerificationPage } from '../pages/tasks/verification/TaskVerificationPage';
import AuthInitializer from '../components/auth/AuthInitializer';
import AfterVerified from '../pages/dashboard/afterVerified';

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
