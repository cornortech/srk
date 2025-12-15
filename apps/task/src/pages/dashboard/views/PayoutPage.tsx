import React from 'react';
import { LegacyPayoutView as LegacyPayoutViewComponent } from '../../../features/dashboard/views/LegacyPayoutView';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '../../../features/dashboard/types';

export const PayoutPage: React.FC = () => {
  const navigate = useNavigate();

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

  return <LegacyPayoutViewComponent setDashView={setDashView} />;
};

export default PayoutPage;
