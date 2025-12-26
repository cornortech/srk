import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDashboard } from './UserDashboard';
import useGrowAuthStore from '../store/useGrowAuthStore';
import { api } from '../lib/api';

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useGrowAuthStore();

  const { data: profileData } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', user?._id],
    user?._id ? { params: { userId: user._id } } : ({} as any),
    {
      enabled: !!user?._id,
      refetchOnWindowFocus: true,
      queryKey: ['growProfile', user?._id || ''],
    }
  );

  useEffect(() => {
    if (profileData?.status === 200) {
      const updatedUser = profileData.body.userDetails;
      const payment = profileData.body.enrollmentData?.enrollmentPaymentDetails;
      setUser({
        ...user!,
        status: updatedUser.status as any,
        rejectionReason: payment?.rejectionReason ?? null,
        kycURL: updatedUser.kycURL,
        phone: updatedUser.phone,
        country: updatedUser.country,
        transactionId: payment?.transactionId,
        paymentURL: payment?.paymentUrl,
        paymentMethod: payment?.paymentMethod as any,
        enrollmentData: profileData.body.enrollmentData,
        createdAt: updatedUser.createdAt,
      });
    }
  }, [profileData, setUser]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.status !== 'portalActivated') {
      navigate('/grow/verification-wall');
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
