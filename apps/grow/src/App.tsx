import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GrowLandingPage } from './pages/LandingPage';
import CallbackPage from './pages/CallbackPage';
import AdminCallbackPage from './pages/AdminCallbackPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { GrowVerificationPage } from './pages/VerificationPage';
import { GrowOnlyAdminDashboard } from './pages/GrowAdminDashboard';
import { GrowAffiliateDashboard } from './pages/GrowDashboard';
import { PackageFlowPage } from './pages/PackageFlowPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { ToastProvider } from './lib/contexts/ToastContext';
import ViewerPage from './pages/ViewDocumentPage';
import { UserVerificationPage } from './pages/UserVerificationPage';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
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
    path: '/admin/callback',
    element: <AdminCallbackPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/grow/affiliate/verification',
    element: <GrowVerificationPage />,
  },
  {
    path: '/grow/verification',
    element: <UserVerificationPage />
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminProtectedRoute>
        <GrowOnlyAdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <GrowOnlyAdminDashboard />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/admin/view-document',
    element: (
      <AdminProtectedRoute>
        <ViewerPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/affiliate/dashboard',
    element: <GrowAffiliateDashboard />,
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
