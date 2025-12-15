import { useState, useCallback } from 'react';
import { getAutoCode, SSOCodeResponse } from '@srk/shared/api';

interface UseTaskSSOOptions {
  backendUrl: string;
}

interface UseTaskSSOReturn {
  redirectToTaskProgram: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for SSO redirect from University to Task app
 * Usage:
 * ```tsx
 * const { redirectToTaskProgram, isLoading, error } = useTaskSSO({
 *   backendUrl: 'http://localhost:4000'
 * });
 * 
 * <Button onClick={redirectToTaskProgram} disabled={isLoading}>
 *   Go to Task Program
 * </Button>
 * ```
 */
export const useTaskSSO = ({ backendUrl }: UseTaskSSOOptions): UseTaskSSOReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToTaskProgram = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SSOCodeResponse = await getAutoCode(backendUrl, 'task');

      if (response.success && response.data?.redirectUrl) {
        // Redirect to task app with the SSO code
        window.location.href = response.data.redirectUrl;
      } else {
        setError(response.message || 'Failed to generate SSO code');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'SSO redirect failed';
      setError(errorMessage);
      console.error('SSO redirect error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  return {
    redirectToTaskProgram,
    redirectToSocialMediaProgram,
    isLoading,
    error,
  };
};

export default useTaskSSO;
