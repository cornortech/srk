import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GrowLandingPage } from './pages/LandingPage';
import CallbackPage from './pages/CallbackPage';
import { LoginPage } from './pages/LoginPage';
import { GrowVerificationPage } from './pages/VerificationPage';
import { GrowOnlyAdminDashboard } from './pages/GrowAdminDashboard';
import { GrowDashboard } from './pages/GrowDashboard';
import { PackageFlowPage } from './pages/PackageFlowPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { ToastProvider } from './lib/contexts/ToastContext';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <GrowLandingPage />,
  },
  {
    path: '/landing/:section',
    element: <GrowLandingPage />,
  },
  {
    path: '/package-flow',
    element: <PackageFlowPage />,
  },
  {
    path: '/order-confirmation',
    element: <OrderConfirmationPage />,
  },
  {
    path: '/dashboard',
    element: <UserDashboardPage />,
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
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
