import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, Loader2, Key } from 'lucide-react';
import { api } from '../lib/api';

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const tokenFromUrl = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (tokenFromUrl) {
      setValue('token', tokenFromUrl);
    }
  }, [tokenFromUrl, setValue]);

  const resetPasswordMutation = api.auth.resetPasswordSrkGrow.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setResetSuccess(true);
      }
    },
    onError: (error: any) => {
      console.error('Reset password error:', error);
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate({
      body: {
        token: data.token,
        newPassword: data.newPassword,
      },
    });
  };

  if (resetSuccess) {
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
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-green-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent mb-4">
              Password Reset Successful!
            </h2>
            <p className="text-gray-400 mb-8">
              Your password has been successfully reset. You can now login with
              your new password.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] text-black rounded-xl font-bold"
              style={{
                boxShadow: '0 0 30px rgba(182, 137, 56, 0.3)',
              }}
            >
              Go to Login
            </motion.button>
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
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent mb-2">
              Reset Password
            </h2>
            <p className="text-gray-400">
              Enter your new password below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Token Input */}
            <div className="relative">
              <label className="text-sm text-gray-400 mb-2 block font-medium">
                Reset Code
              </label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
                <input
                  {...register('token')}
                  type="text"
                  className={`w-full bg-black/40 text-white pl-12 pr-4 py-4 rounded-xl border ${
                    errors.token ? 'border-red-500' : 'border-white/10'
                  } focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm`}
                  placeholder="Enter your reset code"
                  disabled={resetPasswordMutation.isPending}
                />
              </div>
              {errors.token && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.token.message}
                </p>
              )}
            </div>

            {/* New Password Input */}
            <div className="relative">
              <label className="text-sm text-gray-400 mb-2 block font-medium">
                New Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
                <input
                  {...register('newPassword')}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full bg-black/40 text-white pl-12 pr-12 py-4 rounded-xl border ${
                    errors.newPassword ? 'border-red-500' : 'border-white/10'
                  } focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm`}
                  placeholder="Enter new password"
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b68938] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <label className="text-sm text-gray-400 mb-2 block font-medium">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`w-full bg-black/40 text-white pl-12 pr-12 py-4 rounded-xl border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                  } focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm`}
                  placeholder="Confirm new password"
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#b68938] transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="relative w-full py-4 mt-2 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-[length:200%_100%] text-black rounded-xl font-bold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={resetPasswordMutation.isPending}
              style={{
                boxShadow: '0 0 30px rgba(182, 137, 56, 0.3)',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: resetPasswordMutation.isPending ? ['-100%', '100%'] : '0%',
                }}
                transition={{
                  duration: 1,
                  repeat: resetPasswordMutation.isPending ? Infinity : 0,
                  ease: 'linear',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-400 hover:text-[#b68938] transition-colors"
            >
              Remember your password?{' '}
              <span className="text-[#b68938]">Back to Login</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
