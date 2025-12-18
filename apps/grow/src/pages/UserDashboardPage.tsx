import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDashboard } from './UserDashboard';
import useGrowAuthStore from '../store/useGrowAuthStore';
import { api } from '../lib/api';

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useGrowAuthStore();

  const { data: profileData } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', user?._id || ''],
    { params: { id: user?._id || '' } },
    {
      enabled: !!user?._id,
      refetchOnWindowFocus: true,
      queryKey: ['growProfile', user?._id || ''],
    }
  );

  useEffect(() => {
    if (profileData?.status === 200) {
      const updatedUser = profileData.body.result;
      setUser({
        ...user!,
        status: updatedUser.status as any,
        rejectionReason: updatedUser.rejectionReason,
        kycURL: updatedUser.kycURL,
        phone: updatedUser.phone,
        country: updatedUser.country,
        createdAt: updatedUser.createdAt,
        transactionId: updatedUser.transactionId,
        paymentURL: updatedUser.paymentURL,
        paymentMethod: updatedUser.paymentMethod as any,
      });
    }
  }, [profileData, setUser]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.status !== 'portalActivated') {
      navigate('/grow/verification');
    }
  }, [user, navigate]);

  if (!user || user.status !== 'portalActivated') {
    return null;
  }

  return (
    <UserDashboard
      user={user as any}
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    />
  );
};
