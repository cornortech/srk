import React from 'react';
import { TasksView as TasksViewComponent } from '../../../features/dashboard/views/TasksView';
import { useDashboardContext } from '../layout/DashboardLayoutWrapper';
import { useNavigate } from 'react-router-dom';
import { DashboardView } from '../../../features/dashboard/types';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isApproved,
    rejectedTasks,
    setTaskCategory,
    setReviewingRejectedTask,
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
    <TasksViewComponent
      isApproved={isApproved}
      setDashView={setDashView}
      rejectedTasks={rejectedTasks}
      setTaskCategory={setTaskCategory}
      setReviewingRejectedTask={setReviewingRejectedTask}
    />
  );
};

export default TasksPage;
