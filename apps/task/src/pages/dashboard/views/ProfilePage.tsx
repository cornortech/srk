import React from 'react';
import { ProfileView as ProfileViewComponent } from '../../../features/dashboard/views/ProfileView';
import { useDashboardContext } from '../layout/DashboardLayoutWrapper';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '../../../features/dashboard/types';
import { analyticsData } from '../../../data/dummyDashboardMockData';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isApproved,
    profile,
    hasPurchased,
    completed,
  } = useDashboardContext();

  const setDashView = (view: DashboardView) => {
    const routeMap: Record<DashboardView, string> = {
      verification: '/task/dashboard/verification',
      analytics: '/task/dashboard/analytics',
      tasks: '/task/dashboard/tasks',
      leaderboard: '/task/dashboard/leaderboard',
      coinExchange: '/task/dashboard/coin-exchange',
      profile: '/task/dashboard/profile',
      payout: '/task/dashboard/payout',
      logout: '/task/onboarding',
    };
    navigate(routeMap[view]);
  };

  return (
    <ProfileViewComponent
      isApproved={isApproved}
      setDashView={setDashView}
      profile={profile}
      hasPurchased={hasPurchased}
      completed={completed}
      analyticsData={analyticsData}
    />
  );
};

export default ProfilePage;
