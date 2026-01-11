import { useState, useCallback } from 'react';
import { getAutoCode, SSOCodeResponse } from '@srk/shared/api';

interface UseTaskAdminSSOOptions {
  backendUrl: string;
}

interface UseTaskAdminSSOReturn {
  redirectToTaskAdmin: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for admin SSO redirect from University to Task admin dashboard
 * This is triggered automatically after admin login with domain='task'
 */
export const useTaskAdminSSO = ({
  backendUrl,
}: UseTaskAdminSSOOptions): UseTaskAdminSSOReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToTaskAdmin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SSOCodeResponse = await getAutoCode(backendUrl, 'task');

      if (response.success && response.data?.redirectUrl) {
        // Redirect to task admin with SSO code
        window.location.href = response.data.redirectUrl;
      } else {
        setError(response.message || 'Failed to generate admin SSO code');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Admin SSO redirect failed';
      setError(errorMessage);
      console.error('Admin SSO redirect error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  return {
    redirectToTaskAdmin,
    isLoading,
    error,
  };
};
