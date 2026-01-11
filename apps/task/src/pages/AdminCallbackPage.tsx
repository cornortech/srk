import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { exchangeCode } from '@srk/shared/api';
import '../App.css';

/**
 * Admin SSO Callback Page for Task App
 * Handles admin authentication when redirected from university login
 *
 * Flow:
 * 1. Admin logs in at university with domain='task'
 * 2. University backend generates SSO code and redirects to /admin/callback?code=XXXXX
 * 3. This page exchanges code for JWT token
 * 4. Sets auth cookies and redirects to task admin dashboard
 */

const AdminCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Authenticating admin...');

  useEffect(() => {
    const handleAdminSSO = async () => {
      const code = searchParams.get('code');

      if (!code) {
        setStatus('error');
        setMessage('No authentication code provided');
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 2000);
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
        const response = await exchangeCode(backendUrl, code);

        if (response.success && response.user) {
          // Verify it's an admin
          if (response.user.role !== 'admin') {
            setStatus('error');
            setMessage('Unauthorized - Admin access required');
            setTimeout(() => {
              navigate('/auth/login', { replace: true });
            }, 2000);
            return;
          }

          setStatus('success');
          setMessage('Admin authentication successful! Redirecting...');

          // Store admin info if needed
          localStorage.setItem('adminUser', JSON.stringify({
            _id: response.user._id,
            email: response.user.email,
            role: response.user.role,
          }));

          // Redirect to admin dashboard
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 1000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Admin authentication failed');
          setTimeout(() => {
            navigate('/auth/login', { replace: true });
          }, 2000);
        }
      } catch (err: any) {
        console.error('Admin SSO callback error:', err);
        setStatus('error');
        setMessage(
          err.response?.data?.message ||
          'Admin authentication failed. Please try again.'
        );
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 2000);
      }
    };

    handleAdminSSO();
  }, [searchParams, navigate]);

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

export default AdminCallbackPage;
