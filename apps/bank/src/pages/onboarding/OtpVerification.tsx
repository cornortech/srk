import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuth';
import { bankApi } from '../../utils/api/bank/bank.api';

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { userDetails } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!userDetails) {
      setError('User details not found');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      await bankApi.validateBankRegistrationOtp(userDetails._id, otp);
      navigate('/onboarding/upload-image');
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userDetails) {
      setError('User details not found');
      return;
    }

    setCountdown(60);
    setCanResend(false);

    await bankApi.sendBankRegistrationOtp(userDetails._id);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-8 sm:py-12">
      <Card className="w-full max-w-md bg-[#1a1a1a] border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 relative p-6 sm:p-8 rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center gap-3 sm:gap-4 pt-2 pb-4">
          {/* Decorative Icon */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl mb-2 sm:mb-3"
            style={{ background: 'linear-gradient(125deg, #e1ba73, #b68938)' }}
          >
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#b68938' }}
          >
            Verify Your Phone
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-sm">
            We've sent a 6-digit code to your phone number
          </p>
        </CardHeader>

        <CardBody className="px-0 sm:px-2">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {error && (
              <div className="bg-red-950/30 border border-red-800/50 text-red-400 p-3 sm:p-4 rounded-xl text-sm sm:text-base backdrop-blur-sm flex items-start gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <div
              className="bg-[#2a2520] border border-[#b68938]/50 p-3 sm:p-4 rounded-xl text-sm sm:text-base flex items-start gap-3"
              style={{ color: '#b68938' }}
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="leading-relaxed">
                For demo purposes, use OTP:{' '}
                <strong className="font-bold">123456</strong>
              </div>
            </div>

            <Input
              id="otp"
              type="text"
              variant="bordered"
              label="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              maxLength={6}
              classNames={{
                input:
                  'text-center text-2xl sm:text-3xl tracking-widest text-white font-semibold',
                inputWrapper:
                  'bg-[#2a2520] border-[#b68938]/40 hover:border-[#b68938]/60 focus-within:border-[#b68938] transition-colors h-14 sm:h-16',
                label: 'text-[#b68938] text-base sm:text-lg',
              }}
              required
            />

            <Button
              type="submit"
              className="w-full text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 h-12 sm:h-14 text-base sm:text-lg"
              style={{
                background: 'linear-gradient(125deg, #e1ba73, #b68938)',
              }}
              isDisabled={isLoading || otp.length !== 6}
              isLoading={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="mt-6 sm:mt-8 text-center">
            {canResend ? (
              <Button
                variant="light"
                className="font-medium text-base sm:text-lg h-10 sm:h-12"
                style={{ color: '#b68938' }}
                onPress={handleResendOTP}
              >
                Resend OTP
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#b68938] animate-pulse"></div>
                <p className="text-gray-400 text-sm sm:text-base">
                  Resend OTP in{' '}
                  <span style={{ color: '#b68938' }} className="font-semibold">
                    {countdown}s
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Decorative Bottom Border */}
          <div
            className="mt-6 sm:mt-8 h-px w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, #b68938, transparent)',
              opacity: 0.3,
            }}
          ></div>
        </CardBody>
      </Card>
    </div>
  );
}
