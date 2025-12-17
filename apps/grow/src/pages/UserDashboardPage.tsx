import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDashboard } from './UserDashboard';
import { UserData } from '../lib/types/types';

export const UserDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('srkgrow-activesession');
    if (savedUser) {
      const parsedUser: UserData = JSON.parse(savedUser);
      setUser(parsedUser);

      if (parsedUser.kycStatus !== 'approved') {
        navigate('/grow/verification');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('srkgrow-activesession');
    navigate('/');
  };

  if (!user) return null;

  return <UserDashboard user={user} onLogout={handleLogout} />;
};
