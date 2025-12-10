import React, { useEffect } from 'react';
import useTaskAuthStore from '../../store/useTaskAuthStore';
import { getMe } from '@srk/shared/api';
import env from '../../lib/env';

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setLoading } = useTaskAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe(env.backendUrl);
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('Not authenticated', error);
        setUser(null);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return <>{children}</>;
};

export default AuthInitializer;
