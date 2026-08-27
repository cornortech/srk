import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@srk/shared/contracts';
import { z } from 'zod';

type LoginFormData = z.infer<typeof LoginSchema>;

interface LoginFormProps {
  onLoginSuccess?: (email: string) => void;
  onBuyPackage?: () => void;
  onSubmit?: (data: LoginFormData) => void;
  isLoading?: boolean;
  externalError?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onBuyPackage,
  onSubmit,
  isLoading: externalLoading = false,
  externalError = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loading = externalLoading;

  const onFormSubmit = (data: LoginFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-black/60 to-black/40 rounded-2xl p-8 border border-[#b68938]/20 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-[#e1ba73] to-white bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400">Sign in to continue to your account</p>
        </div>

        {/* External Error Message */}
        {externalError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <p className="text-red-400 text-sm font-medium">{externalError}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col gap-5"
        >
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
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="text-sm text-gray-400 mb-2 block font-medium">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#b68938] transition-colors" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full bg-black/40 text-white pl-12 pr-12 py-4 rounded-xl border ${
                  errors.password ? 'border-red-500' : 'border-white/10'
                } focus:border-[#b68938]/50 focus:bg-black/60 transition-all outline-none backdrop-blur-sm`}
                placeholder="••••••••"
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="relative w-full py-4 mt-2 bg-gradient-to-r from-[#b68938] via-[#e1ba73] to-[#b68938] bg-[length:200%_100%] text-black rounded-xl font-bold overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            style={{
              boxShadow: '0 0 30px rgba(182, 137, 56, 0.3)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: loading ? ['-100%', '100%'] : '0%' }}
              transition={{
                duration: 1,
                repeat: loading ? Infinity : 0,
                ease: 'linear',
              }}
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </span>
          </motion.button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-gray-400 hover:text-[#b68938] transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 text-[13px]">
          <p> Haven't bought package yet?</p>
          <button
            type="button"
            className="flex items-center justify-center text-[#b68938] hover:italic"
            onClick={onBuyPackage}
          >
            Buy Now
            <ArrowRight className="h-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            By continuing, you agree to our{' '}
            <span className="text-[#b68938] hover:text-[#e1ba73] cursor-pointer transition-colors">
              Terms of Service
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};
