import { useState } from 'react';
import { getAutoCodeApi } from '@srk/shared/api';

/**
 * Hook to handle SSO redirect to Bank Program
 * Use this in the University app to redirect authenticated users to the Bank app
 */
export const useBankSSO = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToBankProgram = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getAutoCodeApi();

      if (response.success && response.data) {
        window.location.href = response.data.redirectUrl;
      } else {
        setError(response.message || 'Failed to generate authentication code');
      }
    } catch (err: any) {
      console.error('SSO redirect error:', err);
      setError(err.response?.data?.message || 'Failed to redirect to Bank Program');
      setIsLoading(false);
    }
  };

  return {
    redirectToBankProgram,
    isLoading,
    error,
  };
};
