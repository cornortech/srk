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
import { BlogPost } from './pages/BlogPost';
import Articles from './pages/articles/ArticleFirst';
import ArticlePage from './pages/articles/ArticlePage';

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
    element: <BlogPost />,
  },
  {
    path:'/articles' ,
    element: <Articles/>
  },
  {
    path: '/articles/:slug',
    element: <ArticlePage />,
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
        <RouterProvider router={router} />
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;
