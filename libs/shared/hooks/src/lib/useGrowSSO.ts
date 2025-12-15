import { useState, useCallback } from 'react';
import { getAutoCode, SSOCodeResponse } from '@srk/shared/api';

interface UseGrowSSOOptions {
  backendUrl: string;
}

interface UseGrowSSOReturn {
  redirectToGrowAffiliateProgram: () => Promise<void>;
  redirectToGrowSocialMediaProgram: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const useGrowSSO = ({ backendUrl }: UseGrowSSOOptions): UseGrowSSOReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRedirect = useCallback(
    async (program: 'growaffiliate' | 'growsocialmedia') => {
      setIsLoading(true);
      setError(null);

      try {
        const response: SSOCodeResponse = await getAutoCode(backendUrl, program);

        if (response.success && response.data?.redirectUrl) {
          window.location.href = response.data.redirectUrl;
        } else {
          setError(response.message || 'Failed to generate SSO code');
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'SSO redirect failed';

        setError(errorMessage);
        console.error('SSO redirect error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [backendUrl]
  );

  const redirectToGrowAffiliateProgram = () => handleRedirect('growaffiliate');
  const redirectToGrowSocialMediaProgram = () =>
    handleRedirect('growsocialmedia');

  return {
    redirectToGrowAffiliateProgram,
    redirectToGrowSocialMediaProgram,
    isLoading,
    error,
  };
};

export default useGrowSSO;
