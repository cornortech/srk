import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import GrowLandingPage from './pages/landing-page/page';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <GrowLandingPage />,
  },
//   {
//     path: '/login',
//     element: <Login />,
//   },
//   {
//     path: '/callback',
//     element: <Callback />,
//   },
//   {
//     path: '/task/dashboard',
//     element: <AfterVerified />,
//   },
//   {
//     path: '/dashboard',
//     element: <Dashboard />,
//   },
]);


function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;