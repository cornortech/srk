import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPasswordMutation = api.auth.forgotPasswordSrkGrow.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setEmailSent(true);
      }
    },
    onError: (error: any) => {
      console.error('Forgot password error:', error);
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate({
      body: data,
    });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-black flex items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-gradient-to-br from-black/60 to-black/40 rounded-2xl p-8 border border-[#b68938]/20 backdrop-blur-xl shadow-2xl text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-[#b68938]/20 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-[#b68938]" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-400 mb-2">
              We've sent a password reset link to
            </p>
            <p className="text-[#e1ba73] font-semibold mb-4">
              {getValues('email')}
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Please check your email and click on the link to reset your
              password. The link will expire in 1 hour.
            </p>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] text-black rounded-xl font-bold"
                style={{
                  boxShadow: '0 0 30px rgba(182, 137, 56, 0.3)',
                }}
              >
                Back to Login
              </motion.button>
              <button
                onClick={() => setEmailSent(false)}
                className="w-full text-[#b68938] text-sm hover:text-[#e1ba73] transition-colors"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-black/60 to-black/40 rounded-2xl p-8 border border-[#b68938]/20 backdrop-blur-xl shadow-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-[#b68938] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-400">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="relative">
              <label className="text-sm text-gray-400 mb-2 block font-medium">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full bg-black/40 text-white pl-12 pr-4 py-4 rounded-xl border ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  } focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm`}
                  placeholder="you@example.com"
                  disabled={forgotPasswordMutation.isPending}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="relative w-full py-4 mt-2 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-[length:200%_100%] text-black rounded-xl font-bold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={forgotPasswordMutation.isPending}
              style={{
                boxShadow: '0 0 30px rgba(182, 137, 56, 0.3)',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: forgotPasswordMutation.isPending ? ['-100%', '100%'] : '0%',
                }}
                transition={{
                  duration: 1,
                  repeat: forgotPasswordMutation.isPending ? Infinity : 0,
                  ease: 'linear',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </span>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
