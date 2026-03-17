import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { exchangeCode } from '@srk/shared/api';
import { useBankAuthStore } from '../../store/useBankAuthStore';
import useAuthStore from '../../store/useAuth';
import env from '../../libs/env';

/**
 * SSO Callback Page
 * This page handles the SSO code exchange when redirected from university app
 *
 * Flow:
 * 1. University app redirects to /callback?code=XXXXX
 * 2. This page extracts the code from URL
 * 3. Calls backend to exchange code for JWT token
 * 4. On success, sets user in store and redirects to dashboard
 * 5. On failure, shows error and redirects to login
 */

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setLoading } = useBankAuthStore();
  const { setAuthDetails } = useAuthStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState('Authenticating...');

  const calledRef = useRef(false);

  useEffect(() => {
    const handleSSOCallback = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      const code = searchParams.get('code');
      const affiliateId = searchParams.get('affiliateId');

      // Store affiliateId if present
      if (affiliateId) {
        localStorage.setItem('affiliateBankUserId', affiliateId);
      }

      if (!code) {
        setStatus('error');
        setMessage('No authentication code provided');
        // setTimeout(() => {
        //   navigate('/login', { replace: true });
        // }, 2000);
        return;
      }

      try {
        setLoading(true);
        const response = await exchangeCode(env.backendUrl, code);

        if (response.success && response.user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          // Set user in both stores safely
          const bankUser = {
            _id: response.user.universityId,
            email: response.user.email,
            fullName:
              `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim(),
          };

          setUser(bankUser);

          // Sync common auth store for components that depend on it
          setAuthDetails({
            authDetails: {
              role: response.user.role as 'admin' | 'user',
              email: response.user.email,
              redirectionUrl: response.user.redirectionUrl,
            },
            srkBank: {
              _id: '', // We don't have the SRK bank record ID directly from SSO yet, but we have bankDetailsId
              accountNumber: null,
              status: null,
              amount: 0,
              bankDetailsId: response.user.bankDetailsId || null,
            },
            userDetails: {
              ...response.user,
              _id: response.user.universityId,
              firstName: response.user.firstName || '',
              lastName: response.user.lastName || '',
              phoneNumber: response.user.phoneNumber || '',
              gender: (response.user.gender as any) || 'Other',
              dob: response.user.dob || '',
              country: response.user.country || '',
              bankDetailsId: response.user.bankDetailsId || null, // Also keep it in userDetails if needed
              affiliateEnabled: response.user.affiliateEnabled || false,
              isActive: response.user.isActive || true,
              status: response.user.status || 'REGISTERED',
              purpose: response.user.purpose || 'study',
            } as any,
          });

          // Navigate on success
          setTimeout(() => {
            navigate(response.user?.redirectionUrl || '/dashboard', {
              replace: true,
            });
          }, 500);
        } else {
          console.error('SSO callback failed:', response);
          setStatus('error');
          setMessage(response.message || 'Authentication failed');
        }
      } catch (err: any) {
        console.error('SSO callback error:', err);
        setStatus('error');
        setMessage(
          err.response?.data?.message ||
            'Authentication failed. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    handleSSOCallback();
  }, [searchParams, navigate, setUser, setLoading]);

  return (
    <div className="loading-container">
      {status === 'loading' && <div className="spinner" />}

      {status === 'success' && (
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}

      {status === 'error' && (
        <svg
          width="50"
          height="50"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      )}

      <p
        style={{
          color:
            status === 'error'
              ? '#ef4444'
              : status === 'success'
                ? '#22c55e'
                : '#fff',
          fontSize: '1.1rem',
          marginTop: '1rem',
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default CallbackPage;
