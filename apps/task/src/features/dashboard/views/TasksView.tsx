import React, { useEffect, useState } from 'react';
import { ChevronRight, Clock, Coins, Share2, Shield, Users } from 'lucide-react';
import { followTasks, likeTasks } from '../../../data/dummyDashboardMockData';
import { DashboardView, RejectedTaskEntry, TaskType } from '../types';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

interface TasksViewProps {
  isApproved: boolean;
  setDashView: (view: DashboardView) => void;
  setTaskCategory: (type: TaskType) => void;
  setReviewingRejectedTask: (task: RejectedTaskEntry) => void;
}

const isWithinAllowedTime = (): boolean => {
  const h = new Date().getHours();
  return h >= 19 && h < 24;
};

const categories = [
  {
    type: 'follow' as TaskType,
    icon: Users,
    label: 'Follow tasks',
    count: followTasks.length,
    coins: '100+',
  },
  {
    type: 'like' as TaskType,
    icon: Share2,
    label: 'Like tasks',
    count: likeTasks.length,
    coins: '100+',
  },
];

export const TasksView: React.FC<TasksViewProps> = ({
  isApproved,
  setDashView,
  setTaskCategory,
}) => {
  const { taskUserID } = useTaskAuthStore();
  const [isTaskTimeAllowed, setIsTaskTimeAllowed] = useState(isWithinAllowedTime());

  const { data: appSettingsData } = api.appSettings.getAppSettings.useQuery(
    ['getAppSettings'],
    {},
    { queryKey: ['getAppSettings'], refetchInterval: 60000 }
  );

  const isTaskFeatureEnabled = appSettingsData?.body?.data?.taskFeatureEnabled ?? true;
  const areTasksAllowed = isTaskFeatureEnabled && isTaskTimeAllowed;

  useEffect(() => {
    const interval = setInterval(() => setIsTaskTimeAllowed(isWithinAllowedTime()), 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isApproved) {
    return (
      <div className="border border-white/[0.08] p-12 text-center max-w-lg">
        <div className="w-10 h-10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5">
          <Shield size={18} className="text-amber-400" />
        </div>
        <h3 className="text-base font-semibold text-white mb-2">
          Verification required
        </h3>
        <p className="text-sm text-white/40 mb-6">
          Complete identity verification to access tasks
        </p>
        <button
          onClick={() => setDashView('verification')}
          className="px-5 py-2.5 bg-primary text-black text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Go to verification
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-2">
          Tasks
        </p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Earning Tasks
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Complete tasks to earn coins. Select a category to begin.
        </p>
      </div>

      {/* Time window status */}
      <div
        className={`flex items-center gap-4 px-5 py-4 border ${
          areTasksAllowed
            ? 'border-emerald-500/25 bg-emerald-500/[0.04]'
            : 'border-amber-500/25 bg-amber-500/[0.04]'
        }`}
      >
        <div
          className={`w-7 h-7 border flex items-center justify-center flex-shrink-0 ${
            areTasksAllowed ? 'border-emerald-500/30 text-emerald-400' : 'border-amber-500/30 text-amber-400'
          }`}
        >
          <Clock size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${areTasksAllowed ? 'text-emerald-400' : 'text-amber-400'}`}>
            {areTasksAllowed ? 'Tasks are available now' : 'Tasks currently unavailable'}
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {!isTaskFeatureEnabled
              ? 'Task feature is currently disabled by admin.'
              : !isTaskTimeAllowed
              ? 'Tasks are available daily between 7:00 PM and 12:00 AM.'
              : 'You can complete tasks until 12:00 AM.'}
          </p>
        </div>
        {isTaskFeatureEnabled && (
          <span className="text-xs text-white/25 flex-shrink-0 tabular-nums">
            7 PM – 12 AM
          </span>
        )}
      </div>

      {/* Task category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06]">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.type}
              onClick={() => areTasksAllowed && setTaskCategory(cat.type)}
              disabled={!areTasksAllowed}
              className={[
                'group bg-bgPrimary text-left p-8 flex flex-col gap-6 transition-colors duration-150',
                areTasksAllowed
                  ? 'hover:bg-bgSecondary/40 cursor-pointer'
                  : 'opacity-40 cursor-not-allowed',
              ].join(' ')}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <ChevronRight
                  size={16}
                  className="text-white/20 group-hover:text-white/50 transition-colors mt-1"
                />
              </div>

              <div>
                <h3 className="text-base font-semibold text-white/90 mb-1">
                  {cat.label}
                </h3>
                <p className="text-sm text-white/40">
                  {cat.count} available
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-3 border-t border-white/[0.06]">
                <Coins size={13} className="text-primary" />
                <span className="text-sm font-semibold text-white/70 tabular-nums">
                  {cat.coins}
                </span>
                <span className="text-xs text-white/30">coins per task</span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
