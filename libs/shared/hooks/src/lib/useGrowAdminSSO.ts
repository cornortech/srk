import { useState, useCallback } from 'react';
import { getAutoCode, SSOCodeResponse } from '@srk/shared/api';

interface UseGrowAdminSSOOptions {
  backendUrl: string;
}

interface UseGrowAdminSSOReturn {
  redirectToGrowAdmin: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for admin SSO redirect from University to Grow admin dashboard
 * This is triggered automatically after admin login with domain='grow'
 */
export const useGrowAdminSSO = ({
  backendUrl,
}: UseGrowAdminSSOOptions): UseGrowAdminSSOReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToGrowAdmin = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SSOCodeResponse = await getAutoCode(backendUrl, 'growaffiliate');

      if (response.success && response.data?.redirectUrl) {
        // Redirect to grow admin with SSO code
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
    redirectToGrowAdmin,
    isLoading,
    error,
  };
};
