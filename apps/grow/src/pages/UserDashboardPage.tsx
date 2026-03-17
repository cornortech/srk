import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDashboard } from './UserDashboard';
import useGrowAuthStore from '../store/useGrowAuthStore';
import { api } from '../lib/api';
import { TGetSrkGrowProfileResponse } from '@srk/shared/contracts';

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user: storeUser, logout } = useGrowAuthStore();

  const { data: profileData, isLoading } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', storeUser?._id],
    storeUser?._id ? { params: { userId: storeUser._id } } : ({} as any),
    {
      queryKey: ['growProfile', storeUser?._id],
      enabled: !!storeUser?._id,
      refetchOnWindowFocus: true,
    }
  );

  const profileResponse: TGetSrkGrowProfileResponse | undefined = profileData?.status === 200 ? profileData.body : undefined;
  const user = profileResponse?.userDetails;

  useEffect(() => {
    if (!storeUser) {
      navigate('/login');
    } else if (storeUser.status !== 'portalActivated') {
      console.log('🔄 Redirecting user with status:', storeUser.status);
      navigate('/grow/verification-wall');
    }
  }, [storeUser, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!storeUser || storeUser.status !== 'portalActivated' || !user) {
    return null;
  }

  return (
    <UserDashboard
      user={user}
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    />
  );
};
