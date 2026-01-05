import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import useGrowAuthStore from '../store/useGrowAuthStore';
import { LoginSchema } from '@srk/shared/contracts';
import { z } from 'zod';
import { LoginForm } from '../features/auth/LoginForm';

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
        navigate('/grow/verification-wall');
      }
    }
  }, [user, navigate]);

  // Profile Query
  // note: passing path param as { userId }
  const { data: profileData } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', userIdToFetch!],
    { params: { userId: userIdToFetch! } },
    {
      enabled: !!userIdToFetch,
      queryKey: ['growProfile', userIdToFetch!],
    }
  );

  // Watch for Profile Data - Only store minimal auth data
  useEffect(() => {
    if (profileData?.status === 200) {
      console.log('✅ Profile data received:', profileData.body.userDetails);
      const userProfile = profileData.body.userDetails;
      
      // Store only minimal auth data
      setUser({
        _id: userProfile._id,
        email: userProfile.email,
        fullName: userProfile.fullName,
        status: userProfile.status as any,
      });
      
      console.log('👤 User status synced:', userProfile.status);

      // Redirect Logic based on status
      if (userProfile.status === 'portalActivated') {
        navigate('/dashboard');
      } else {
        navigate('/grow/verification-wall');
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

        // Set only minimal auth info from login response
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
      LoginSchema.parse(formData);
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
