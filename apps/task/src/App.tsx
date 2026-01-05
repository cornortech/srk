import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { TaskLandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CallbackPage } from './pages/auth/CallbackPage';
import {
  AdminDashboard,
  AfterVerifiedDashboardPage,
  MainDashboardPage,
} from './pages';
import AuthInitializer from './components/auth/AuthInitializer';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <TaskLandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/callback',
    element: <CallbackPage />,
  },
  // {
  //   path: '/task/verification',
  //   element: <TaskVerificationPage />,
  // },
  {
    path: '/task/dashboard',
    element: <AfterVerifiedDashboardPage />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboard />,
  },
  {
    path: '/dashboard',
    element: <MainDashboardPage />,
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
