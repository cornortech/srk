import { useState, useEffect } from 'react';

export interface AuthUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const useAuthAffiliateVerification = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('srkAffiliate-auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        const u = parsed?.state?.user;
        const auth = parsed?.state?.isAuthenticated;

        if (u && auth) {
          setUser(u as AuthUser);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error parsing authState:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { user, isAuthenticated, isLoading };
};
