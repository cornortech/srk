import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthenticateProps {
  children: ReactNode;
}

export function Authenticate({ children }: AuthenticateProps) {
  // Add your authentication logic here
  // For now, it just renders children
  const isAuthenticated = true; // Replace with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/bank/login" replace />;
  }

  return <>{children}</>;
}
