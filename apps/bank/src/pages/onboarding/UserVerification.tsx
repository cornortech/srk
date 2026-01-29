import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Spinner } from '@nextui-org/spinner';
import { ShieldCheck, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuth';
import { bankApi } from '../../utils/api/bank/bank.api';

export default function UserVerification() {
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected'>(
    'pending',
  );
  const navigate = useNavigate();
  const { userDetails, setAuthDetails, authDetails } = useAuthStore();

  useEffect(() => {
    if (!userDetails?._id) return;

    const checkVerificationStatus = async () => {
      try {
        const response = await bankApi.getBankStatus(userDetails._id);
        if (response.status === 200 && response.data) {
          const bankRecord = response.data;

          if (bankRecord.status === 'PORTAL_ACTIVATED') {
            setStatus('verified');

            // Update store
            setAuthDetails({
              authDetails: {
                ...authDetails,
                role: authDetails.role as any,
              },
              srkBank: {
                _id: bankRecord._id,
                accountNumber: bankRecord.accountNumber,
                status: bankRecord.status,
                amount: bankRecord.amount,
                bankDetailsId: bankRecord.bankDetailsId,
              },
              userDetails: userDetails as any,
            });

            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else if (bankRecord.status === 'REJECTED') {
            setStatus('rejected');
          }
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(checkVerificationStatus, 5000);

    // Check once immediately
    checkVerificationStatus();

    return () => clearInterval(interval);
  }, [userDetails, navigate, setAuthDetails, authDetails]);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <Card className="bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 rounded-2xl overflow-hidden">
          {/* Top accent line */}
          <div
            className="h-1.5 w-full"
            style={{
              background: 'linear-gradient(90deg, #e1ba73, #b68938, #e1ba73)',
            }}
          ></div>

          <CardHeader className="flex flex-col items-center text-center gap-4 pt-10 pb-6 px-6">
            <div className="relative">
              {status === 'pending' && (
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#b68938]"></div>
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl relative z-10"
                    style={{ background: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <Clock className="w-10 h-10" style={{ color: '#b68938' }} />
                  </div>
                </div>
              )}

              {status === 'verified' && (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl animate-appearance-in"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  }}
                >
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
              )}

              {status === 'rejected' && (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl animate-appearance-in"
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  }}
                >
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  color:
                    status === 'rejected'
                      ? '#ef4444'
                      : status === 'verified'
                        ? '#22c55e'
                        : '#b68938',
                }}
              >
                {status === 'pending' && 'Verification in Progress'}
                {status === 'verified' && 'Identity Verified'}
                {status === 'rejected' && 'Verification Failed'}
              </h2>
              <p className="text-gray-400 text-sm sm:text-base px-2">
                {status === 'pending' &&
                  'Our team is currently reviewing your documents. This usually takes 24-48 hours.'}
                {status === 'verified' &&
                  'Success! Your SRK Bank account has been activated. Redirecting you to your dashboard...'}
                {status === 'rejected' &&
                  'We could not verify your identity. Please contact support or check your email for details.'}
              </p>
            </div>
          </CardHeader>

          <CardBody className="px-8 pb-10 pt-0 flex flex-col items-center">
            {status === 'pending' && (
              <div className="flex flex-col items-center gap-6 w-full">
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#b68938] animate-progress"
                    style={{
                      width: '40%',
                      boxShadow: '0 0 10px rgba(182, 137, 56, 0.5)',
                    }}
                  ></div>
                </div>

                <div className="flex items-center gap-3 text-sm text-[#b68938]/80 font-medium">
                  <Spinner size="sm" color="warning" />
                  <span>Checking status...</span>
                </div>
              </div>
            )}

            {status === 'rejected' && (
              <button
                onClick={() => navigate('/onboarding/register')}
                className="w-full h-12 rounded-xl border border-[#ef4444] text-[#ef4444] font-semibold hover:bg-[#ef4444]/10 transition-all"
              >
                Go Back to Registration
              </button>
            )}
          </CardBody>
        </Card>

        <p className="text-center text-gray-500 mt-8 text-xs sm:text-sm">
          Protected by SRK Group &copy; 2026
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
