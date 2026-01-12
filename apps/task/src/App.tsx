import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { TaskLandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CallbackPage } from './pages/auth/CallbackPage';
import AdminCallbackPage from './pages/AdminCallbackPage';
import {
  AdminDashboard,
  AfterVerifiedDashboardPage,
  MainDashboardPage,
} from './pages';
import AuthInitializer from './components/auth/AuthInitializer';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { ToastProvider } from './lib/contexts/ToastContext';

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
  {
    path: '/admin/callback',
    element: <AdminCallbackPage />,
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
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    ),
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
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
