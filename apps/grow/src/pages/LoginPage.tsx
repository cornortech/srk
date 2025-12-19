import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/user-components/auth/LoginForm';
import { api } from '../lib/api';
import useGrowAuthStore, { GrowUser } from '../store/useGrowAuthStore';
import { LoginSrkGrowSchema } from '@srk/shared/contracts';
import { z } from 'zod';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useGrowAuthStore((state) => state.setUser);
  const user = useGrowAuthStore((state) => state.user);
  const [userIdToFetch, setUserIdToFetch] = useState<string | null>(null);

  // Guard: Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.status === 'portalActivated') {
        navigate('/dashboard');
      } else {
        navigate('/grow/verification');
      }
    }
  }, [user, navigate]);

  // Profile Query
  const { data: profileData } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', userIdToFetch!],
    { params: { id: userIdToFetch! } },
    {
      enabled: !!userIdToFetch,
      queryKey: ['growProfile', userIdToFetch!],
    }
  );

  // Watch for Profile Data
  useEffect(() => {
    if (profileData?.status === 200) {
      console.log('✅ Profile data received:', profileData.body.result);
      const userProfile = profileData.body.result;
      // Map to GrowUser
      const growUser: GrowUser = {
        _id: userProfile._id,
        email: userProfile.email,
        fullName: userProfile.fullName,
        status: userProfile.status as any,
        kycURL: userProfile.kycURL,
        rejectionReason: userProfile.rejectionReason,
        phone: userProfile.phone,
        country: userProfile.country,
        createdAt: userProfile.createdAt,
      };

      setUser(growUser);
      console.log('👤 User status synced:', growUser.status);

      // Redirect Logic based on synced status
      if (growUser.status === 'portalActivated') {
        navigate('/dashboard');
      } else {
        navigate('/grow/verification');
      }
    }
  }, [profileData, navigate, setUser]);

  const [loginError, setLoginError] = useState<string | null>(null);

  // Login Mutation
  const loginMutation = api.auth.loginSrkGrow.useMutation({
    onSuccess: (data) => {
      console.log('📡 Login response:', data);
      if (data.status === 200) {
        const { user: loginUser } = data.body;
        const redirectionUrl = loginUser.redirectionUrl;
        console.log('🎯 Login successful for:', loginUser.email);

        // Set basic user info from login response
        setUser({
          _id: loginUser._id,
          email: loginUser.email,
          fullName: loginUser.fullName || '',
          status: (loginUser.status as any) || 'verificationPending',
        });

        // Navigate immediately if redirectionUrl exists
        if (redirectionUrl) {
          console.log('🚀 Immediate redirect:', redirectionUrl);
          navigate(redirectionUrl);
        } else {
          // Fallback to profile fetch
          setUserIdToFetch(loginUser._id);
        }
        setLoginError(null);
      } else {
        setLoginError(data.body.message || 'Login failed');
      }
    },
    onError: (err) => {
      console.error('❌ Login error:', err);
      setLoginError('An unexpected error occurred. Please try again.');
    },
  });

  const handleLoginSubmit = (formData: { email: string; password: string }) => {
    console.log('🔐 Login attempt:', formData.email);
    setLoginError(null); // Clear previous errors

    try {
      LoginSrkGrowSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setLoginError(err.errors[0]?.message || 'Invalid input');
        return;
      }
    }

    loginMutation.mutate({
      body: {
        email: formData.email,
        password: formData.password,
      },
    });
  };

  const handleBuyPackage = () => {
    navigate('/', {
      state: { scrollTo: 'packages' },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#b68938]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#e1ba73]/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full">
        <LoginForm
          onSubmit={handleLoginSubmit}
          onBuyPackage={handleBuyPackage}
          isLoading={loginMutation.isPending}
          externalError={loginError}
        />
      </div>
    </div>
  );
};
