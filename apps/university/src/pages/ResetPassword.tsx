import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import useAlert from '../hooks/useAlert';
import { PrimaryButton } from '../components/ReusableComponents';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

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

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { show } = useAlert();
  const navigate = useNavigate();

  const tokenFromUrl = searchParams.get('token') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordFormValues>({
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

  const resetPasswordMutation = api.auth.resetPassword.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setResetSuccess(true);
        show('Password reset successfully', 'success');
      } else {
        show(data.body.message || 'Failed to reset password', 'error');
      }
    },
    onError: (error: any) => {
      console.error('Reset password error:', error);
      show(
        error?.body?.message || 'Failed to reset password',
        'error'
      );
    },
  });

  function onSubmit(data: ResetPasswordFormValues) {
    resetPasswordMutation.mutate({
      body: {
        token: data.token,
        newPassword: data.newPassword,
      },
    });
  }

  const inputStyle =
    'w-full bg-bgPrimary text-textPrimary px-4 py-4 text-xs rounded-md outline-none border border-slate-50 border-opacity-50 focus:border-primary focus:ring-2 focus:ring-primary';

  const labelStyle =
    'absolute -top-2 left-2 bg-bgSecondary px-1 text-xs text-textPrimary';

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex justify-center items-center px-6 py-8">
        <div className="lg:w-1/3 w-full space-y-6 bg-bgSecondary py-8 px-10 rounded-xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-500" />
            </div>
          </div>
          <h1 className="text-textPrimary text-2xl font-semibold">
            Password Reset Successful!
          </h1>
          <p className="text-textPrimary text-sm opacity-80">
            Your password has been successfully reset. You can now login with
            your new password.
          </p>
          <div className="pt-4">
            <PrimaryButton
              label="Go to Login"
              className="w-full"
              onclick={() => navigate('/auth/login')}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-6 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:w-1/3 w-full space-y-6 bg-bgSecondary py-8 px-10 rounded-xl"
      >
        <div>
          <h1 className="text-textPrimary text-2xl font-semibold mb-2">
            Reset Password
          </h1>
          <p className="text-textPrimary text-sm opacity-80">
            Enter your new password below.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="token" className={labelStyle}>
              Reset Code
            </label>
            <input
              {...register('token')}
              id="token"
              type="text"
              className={inputStyle}
              placeholder="Enter your reset code"
              disabled={resetPasswordMutation.isPending}
            />
            {errors.token && (
              <p className="text-danger text-xs mt-1">{errors.token.message}</p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="newPassword" className={labelStyle}>
              New Password
            </label>
            <input
              {...register('newPassword')}
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              className={inputStyle}
              placeholder="Enter new password"
              disabled={resetPasswordMutation.isPending}
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <Eye size={20} className="text-textPrimary" />
              ) : (
                <EyeOff size={20} className="text-textPrimary" />
              )}
            </div>
            {errors.newPassword && (
              <p className="text-danger text-xs mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className={labelStyle}>
              Confirm Password
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={inputStyle}
              placeholder="Confirm new password"
              disabled={resetPasswordMutation.isPending}
            />
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <Eye size={20} className="text-textPrimary" />
              ) : (
                <EyeOff size={20} className="text-textPrimary" />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-danger text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <PrimaryButton
          label={resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
          className="w-full"
          type="submit"
          disabled={resetPasswordMutation.isPending}
        />

        <p className="text-textPrimary text-center text-sm">
          Remember your password?{' '}
          <Link to="/auth/login">
            <span className="text-primary underline">Back to Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
