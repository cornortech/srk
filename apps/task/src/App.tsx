import './App.css';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { TaskLandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { CallbackPage } from './pages/auth/CallbackPage';
import { AfterVerifiedDashboardPage } from './pages/dashboard/AfterVerifiedDashboardPage';
import AuthInitializer from './components/auth/AuthInitializer';
import { AdminProtectedRoute } from './components/auth/AdminProtectedRoute';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { HowItWorks } from './pages/HowItWorks';
import { Features } from './pages/Features';
import { GettingStarted } from './pages/GettingStarted';
import { Help } from './pages/Help';
import { Blog } from './pages/Blog';

// Admin and rarely-visited pages are split out so regular users don't download
// (or parse) them on every visit to the dashboard.
const AdminCallbackPage = lazy(() => import('./pages/AdminCallbackPage'));
const AdminDashboard = lazy(() =>
  import('./pages/dashboard/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboard,
  }))
);
const MainDashboardPage = lazy(() =>
  import('./pages/dashboard/MainDashboardPage').then((m) => ({
    default: m.MainDashboardPage,
  }))
);
const BlogPost = lazy(() =>
  import('./pages/BlogPost').then((m) => ({ default: m.BlogPost }))
);
const Articles = lazy(() => import('./pages/articles/ArticleFirst'));
const lazyPage = (node: React.ReactNode) => (
  <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
    {node}
  </Suspense>
);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <TaskLandingPage />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/faq',
    element: <FAQ />,
  },
  {
    path: '/how-it-works',
    element: <HowItWorks />,
  },
  {
    path: '/features',
    element: <Features />,
  },
  {
    path: '/getting-started',
    element: <GettingStarted />,
  },
  {
    path: '/help',
    element: <Help />,
  },
  {
    path: '/blog',
    element: <Blog />,
  },
  {
    path: '/blog/:slug',
    element: lazyPage(<BlogPost />),
  },
  {
    path:'/articles' , 
    element: lazyPage(<Articles />)
  },
  {
    path: '/terms-and-conditions',
    element: <TermsAndConditions />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
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
    element: lazyPage(<AdminCallbackPage />),
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
      <AdminProtectedRoute>{lazyPage(<AdminDashboard />)}</AdminProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>{lazyPage(<AdminDashboard />)}</AdminProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: lazyPage(<MainDashboardPage />),
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
