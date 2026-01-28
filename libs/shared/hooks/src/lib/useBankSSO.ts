import { useState, useCallback } from 'react';
import { getAutoCode, SSOCodeResponse } from '@srk/shared/api';

interface UseBankSSOOptions {
  backendUrl: string;
}

interface UseBankSSOReturn {
  redirectToBankProgram: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for SSO redirect from University to Bank app
 * Usage:
 * ```tsx
 * const { redirectToBankProgram, isLoading, error } = useBankSSO({
 *   backendUrl: 'http://localhost:4000'
 * });
 *
 * <Button onClick={redirectToBankProgram} disabled={isLoading}>
 *   Go to Bank Program
 * </Button>
 * ```
 */
export const useBankSSO = ({
  backendUrl,
}: UseBankSSOOptions): UseBankSSOReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToBankProgram = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: SSOCodeResponse = await getAutoCode(backendUrl, 'bank');

      if (response.success && response.data?.redirectUrl) {
        // Redirect to bank app with the SSO code
        window.location.href = response.data.redirectUrl;
      } else {
        setError(response.message || 'Failed to generate SSO code');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'SSO redirect failed';
      setError(errorMessage);
      console.error('SSO redirect error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  return {
    redirectToBankProgram,
    isLoading,
    error,
  };
};
