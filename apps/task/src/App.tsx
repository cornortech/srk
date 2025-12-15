import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { TaskLandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CallbackPage } from './pages/auth/CallbackPage';
import { TaskVerificationPage } from './pages/tasks/verification/TaskVerificationPage';
import { AdminDashboard, MainDashboardPage } from './pages';
import { OnboardingPage } from './pages/onboarding';
import { DashboardLayoutWrapper } from './pages/dashboard/layout';
import {
  VerificationPage,
  AnalyticsPage,
  TasksPage,
  LeaderboardPage,
  CoinExchangePage,
  ProfilePage,
  PayoutPage,
} from './pages/dashboard/views';
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
  {
    path: '/task/verification',
    element: <TaskVerificationPage />,
  },
  {
    path: '/task/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/task/dashboard',
    element: <DashboardLayoutWrapper />,
    children: [
      {
        index: true,
        element: <VerificationPage />,
      },
      {
        path: 'verification',
        element: <VerificationPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
      },
      {
        path: 'coin-exchange',
        element: <CoinExchangePage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'payout',
        element: <PayoutPage />,
      },
    ],
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
