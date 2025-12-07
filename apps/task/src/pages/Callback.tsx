import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTaskAuthStore } from '../store/useTaskAuthStore';
import { apiClient } from '../lib/apiClient';
import '../App.css';

/**
 * SSO Callback Page
 * This page handles the SSO code exchange when redirected from university app
 * 
 * Flow:
 * 1. University app redirects to /callback?code=XXXXX
 * 2. This page extracts the code from URL
 * 3. Calls backend to exchange code for JWT token (type-safe via ts-rest)
 * 4. On success, sets user in store and redirects to dashboard
 * 5. On failure, shows error and redirects to login
 */
const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setLoading } = useTaskAuthStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authenticating...');

  useEffect(() => {
    const handleSSOCallback = async () => {
      const code = searchParams.get('code');

      if (!code) {
        setStatus('error');
        setMessage('No authentication code provided');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
        return;
      }

      try {
        setLoading(true);
        // Type-safe API call using ts-rest client
        const response = await apiClient.exchangeCode({ body: { code } });

        if (response.status === 200 && response.body.success && response.body.user) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');

          const user = response.body.user;

          // Set user in store
          setUser({
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          });

          // Redirect to dashboard
          setTimeout(() => {
            navigate(user.redirectionUrl || '/task/dashboard', { replace: true });
          }, 1000);
        } else {
          setStatus('error');
          if (response.status === 400 || response.status === 404) {
            setMessage(response.body.message || 'Invalid or expired code. Please login again.');
          }
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      } catch (err: any) {
        console.error('SSO callback error:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
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

      <p style={{
        color: status === 'error' ? '#ef4444' : status === 'success' ? '#22c55e' : '#fff',
        fontSize: '1.1rem',
        marginTop: '1rem'
      }}>
        {message}
      </p>
    </div>
  );
};

export default Callback;
