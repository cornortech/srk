import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeApi } from '@srk/shared/api';

/**
 * Callback page for SSO authentication
 * This page handles the auto-code exchange from thesrkuniversity.com
 */

export default function CallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const code = searchParams.get('code');

        if (!code) {
            setError('No authentication code provided');
            setIsProcessing(false);
            setTimeout(() => {
                navigate('/bank/login');
            }, 2000);
            return;
        }

        // Exchange the code for JWT token
        exchangeCodeApi(code)
            .then((response) => {
                if (response.success && response.user) {
                    // Successfully authenticated
                    // Redirect to the appropriate page
                    navigate(response.user.redirectionUrl || '/dashboard');
                } else {
                    setError('Authentication failed');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                }
            })
            .catch((err) => {
                console.error('Code exchange error:', err);
                setError(err.response?.data?.message || 'Invalid or expired authentication code');
                setTimeout(() => {
                    navigate('/bank/login');
                }, 2000);
            })
            .finally(() => {
                setIsProcessing(false);
            });
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1410] to-[#2a2010]">
            <div className="text-center p-8 rounded-2xl bg-black/40 border border-[#b68938]/30 max-w-md">
                {isProcessing ? (
                    <>
                        <div className="w-16 h-16 border-4 border-[#b68938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-white mb-2">Authenticating...</h2>
                        <p className="text-gray-400 text-sm">Please wait while we verify your credentials</p>
                    </>
                ) : error ? (
                    <>
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
                        <p className="text-red-400 text-sm mb-4">{error}</p>
                        <p className="text-gray-400 text-xs">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Success!</h2>
                        <p className="text-gray-400 text-sm">Redirecting to dashboard...</p>
                    </>
                )}
            </div>
        </div>
    );
}
