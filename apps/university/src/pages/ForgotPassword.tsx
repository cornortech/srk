import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import useAlert from '../hooks/useAlert';
import { PrimaryButton } from '../components/ReusableComponents';
import { Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const { show } = useAlert();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const forgotPasswordMutation = api.auth.forgotPassword.useMutation({
    onSuccess: (data) => {
      if (data.status === 200) {
        setEmailSent(true);
        show('Password reset email sent successfully', 'success');
      } else {
        show(data.body.message || 'Failed to send reset email', 'error');
      }
    },
    onError: (error: any) => {
      console.error('Forgot password error:', error);
      show(
        error?.body?.message || 'Failed to send reset email',
        'error'
      );
    },
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    forgotPasswordMutation.mutate({
      body: data,
    });
  }

  const inputStyle =
    'w-full bg-bgPrimary text-textPrimary px-4 py-4 text-xs rounded-md outline-none border border-slate-50 border-opacity-50 focus:border-primary focus:ring-2 focus:ring-primary';

  const labelStyle =
    'absolute -top-2 left-2 bg-bgSecondary px-1 text-xs text-textPrimary';

  if (emailSent) {
    return (
      <div className="min-h-screen flex justify-center items-center px-6 py-8">
        <div className="lg:w-1/3 w-full space-y-6 bg-bgSecondary py-8 px-10 rounded-xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
              <Mail size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-textPrimary text-2xl font-semibold">
            Check Your Email
          </h1>
          <p className="text-textPrimary text-sm opacity-80">
            We've sent a password reset link to{' '}
            <strong>{getValues('email')}</strong>
          </p>
          <p className="text-textPrimary text-sm opacity-80">
            Please check your email and click on the link to reset your
            password. The link will expire in 1 hour.
          </p>
          <div className="space-y-3 pt-4">
            <PrimaryButton
              label="Back to Login"
              className="w-full"
              onclick={() => navigate('/auth/login')}
            />
            <button
              onClick={() => setEmailSent(false)}
              className="w-full text-primary text-sm underline"
            >
              Didn't receive the email? Try again
            </button>
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
            Forgot Password
          </h1>
          <p className="text-textPrimary text-sm opacity-80">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className={labelStyle}>
              Email Address
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className={inputStyle}
              placeholder="Enter your email"
              disabled={forgotPasswordMutation.isPending}
            />
            {errors.email && (
              <p className="text-danger text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <PrimaryButton
          label={forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
          className="w-full"
          type="submit"
          disabled={forgotPasswordMutation.isPending}
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
