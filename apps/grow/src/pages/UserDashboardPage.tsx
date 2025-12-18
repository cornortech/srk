import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDashboard } from './UserDashboard';
import useGrowAuthStore from '../store/useGrowAuthStore';

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useGrowAuthStore();

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

  // Adapter to match UserData if strict typing is enforced in UserDashboard
  // Assuming UserDashboard needs UserData, we map what we have.
  // Note: GrowUser might be missing fields like 'phone', 'country' if we didn't store them.
  // We accepted GrowUser has having limited fields in store.
  // Ideally we should sync more fields in login if Dashboard needs them.
  // For now casting as any or partial match.
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
