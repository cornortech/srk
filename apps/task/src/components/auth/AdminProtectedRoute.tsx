import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '@srk/shared/api';
import { env } from '../../lib'

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route for Admin Pages
 * Verifies admin authentication via cookie before allowing access
 * Redirects to login if not authenticated or not an admin
 */
export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const backendUrl = env.backendUrl || 'http://localhost:4000';
        const response = await getMe(backendUrl);

        if (response.success && response.user?.role === 'admin') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#000',
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTop: '3px solid #E1BA73',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
