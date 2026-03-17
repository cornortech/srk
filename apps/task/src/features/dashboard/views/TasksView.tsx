import React, { useState, useEffect } from 'react';
import {
  // AlertTriangle,
  // CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  // RefreshCw,
  Share2,
  Shield,
  Users,
} from 'lucide-react';
import {
  // allPlatforms,
  followTasks,
  likeTasks,
} from '../../../data/dummyDashboardMockData';
import {
  DashboardView,
  RejectedTaskEntry,
  SocialPlatform,
  TaskType,
} from '../types';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import MagneticButton from '../components/ui/DashboardMagneticButton';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

interface TasksViewProps {
  isApproved: boolean;
  setDashView: (view: DashboardView) => void;
  setTaskCategory: (type: TaskType) => void;
  setReviewingRejectedTask: (task: RejectedTaskEntry) => void;
}

// Utility function to check if current time is within allowed window
const isWithinAllowedTime = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  // Tasks are available between 7pm (19:00) and 10pm (22:00)
  return hours >= 19 && hours < 22;
};

export const TasksView: React.FC<TasksViewProps> = ({
  isApproved,
  setDashView,
  setTaskCategory,
  setReviewingRejectedTask,
}) => {
  const { taskUserID } = useTaskAuthStore();
  const [isTaskTimeAllowed, setIsTaskTimeAllowed] = useState(isWithinAllowedTime());

  // Fetch app settings from backend
  const { data: appSettingsData } = api.appSettings.getAppSettings.useQuery(
    ['getAppSettings'],
    {},
    {
      queryKey: ['getAppSettings'],
      refetchInterval: 60000, // Refetch every minute
    }
  );

  const isTaskFeatureEnabled = appSettingsData?.body?.data?.taskFeatureEnabled ?? true;

  // Tasks are allowed only if BOTH conditions are met:
  // 1. Admin has enabled the task feature
  // 2. Current time is within the allowed window (7pm-10pm)
  const areTasksAllowed = isTaskFeatureEnabled && isTaskTimeAllowed;

  // Check time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTaskTimeAllowed(isWithinAllowedTime());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Fetch rejected tasks from backend
  const { data: rejectedTasksData } =
    api.srkTask.getRejectedSrkTaskActionSubmissionsByUser.useQuery(
      ['getRejectedSrkTaskActionSubmissionsByUser', taskUserID],
      {
        params: { userId: taskUserID || '' },
        query: { page: '1', limit: '100' },
      },
      {
        enabled: !!taskUserID && isApproved,
        queryKey: ['getRejectedSrkTaskActionSubmissionsByUser', taskUserID || ''],
      }
    );

  // Transform backend data to match RejectedTaskEntry type
  const rejectedTasks: RejectedTaskEntry[] =
    rejectedTasksData?.body?.data?.map((task) => {
      const todoData = task.growPackageTodoId;
      const enrollmentData = todoData?.enrollment;
      const packageData = enrollmentData?.growSocialMediaPackageId;
      const packageTypeData = enrollmentData?.growSocialMediaPackageTypeId;
      const platform = todoData?.platform as SocialPlatform;

      return {
        id: task._id,
        taskId: todoData?._id || '',
        platform: platform || 'Instagram',
        type: (task.type || 'follow') as TaskType,
        title: `${task.type} on ${todoData?.platform || 'Unknown'}`,
        desc: `${packageData?.name || 'Package'} - ${packageTypeData?.name || 'Type'}`,
        coins: enrollmentData?.amount || 0,
        difficulty: 'easy' as const,
        estimatedTime: '2-3',
        rejectionReason: task.rejectionReason || 'Task was rejected',
        uploadedProofUrl: task.screenshotUrl || '',
        date: new Date(task.createdAt).toLocaleDateString(),
        adminComment: task.rejectionReason || '',
        canRetry: true,
        username: enrollmentData?.profileLinkURL?.[0] || '',
        profileUrl: todoData?.profileUrl || '',
        postUrl: todoData?.postUrl || '',
      };
    }) || [];

  if (!isApproved) {
    return (
      <DashboardGlassCard className="p-12 text-center">
        <Shield size={48} className="text-yellow-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-3">
          Verification Required
        </h3>
        <p className="text-zinc-400 mb-8">
          Complete identity verification to access tasks
        </p>
        <MagneticButton onClick={() => setDashView('verification')}>
          Go to Verification
        </MagneticButton>
      </DashboardGlassCard>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          <DashboardGradientText>Earning Tasks</DashboardGradientText>
        </h1>
        <p className="text-zinc-400">
          Complete tasks to earn coins. Click on any category to view available
          tasks.
        </p>
      </div>

      {/* Time Restriction Notice */}
      <DashboardGlassCard
        className={`p-6 ${areTasksAllowed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${areTasksAllowed
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/20 text-amber-400'
            }`}>
            <Clock size={24} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 ${areTasksAllowed ? 'text-emerald-400' : 'text-amber-400'
              }`}>
              {areTasksAllowed ? 'Tasks Are Available Now!' : 'Tasks Currently Unavailable'}
            </h3>
            <p className="text-zinc-300 text-sm">
              {!isTaskFeatureEnabled
                ? 'Task feature is currently disabled by admin. Please check back later.'
                : !isTaskTimeAllowed
                  ? 'Tasks can only be done between 7:00 PM and 10:00 PM daily.'
                  : 'You can complete tasks until 10:00 PM. Make the most of your time!'}
            </p>
            {isTaskFeatureEnabled && (
              <p className="text-zinc-400 text-xs mt-1">
                Time window: 7:00 PM - 10:00 PM
              </p>
            )}
          </div>
        </div>
      </DashboardGlassCard>

      {/* Video Feature Toggle */}
      <div className="flex justify-end"></div>

      {/* Video Feature Section */}
      {/* {showVideoFeature && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        ></motion.div>
      )} */}

      {/* Task Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            type: 'follow' as TaskType,
            icon: Users,
            label: 'Follow Tasks',
            color: 'from-emerald-500/20 to-green-500/20',
            count: followTasks.length,
          },
          // {
          //   type: 'watch' as TaskType,
          //   icon: Play,
          //   label: 'Watch Tasks',
          //   color: 'from-blue-500/20 to-cyan-500/20',
          //   count: watchTasks.length,
          // },
          {
            type: 'like' as TaskType,
            icon: Share2,
            label: 'Like Tasks',
            color: 'from-purple-500/20 to-pink-500/20',
            count: likeTasks.length,
          },
        ].map((category) => {
          const Icon = category.icon;
          return (
            <DashboardGlassCard
              key={category.type}
              hover={areTasksAllowed}
              gradient={
                category.type === 'follow'
                  ? 'green'
                  : // : category.type === 'watch'
                  // ? 'blue'
                  'purple'
              }
              onClick={() => areTasksAllowed && setTaskCategory(category.type)}
              className={`${areTasksAllowed
                  ? 'cursor-pointer'
                  // blur it and disable pointer events
                  : 'cursor-not-allowed opacity-30  pointer-events-none blur-[1px]'
                }`}
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-div-to-br ${category.color} flex items-center justify-center`}
                  >
                    <Icon
                      size={28}
                      className={
                        category.type === 'follow'
                          ? 'text-emerald-400'
                          : // : category.type === 'watch'
                          // ? 'text-blue-400'
                          'text-purple-400'
                      }
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {category.label}
                    </h3>
                    <p className="text-zinc-400">
                      {category.count} available tasks
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins size={20} className="text-amber-400" />
                    <span className="text-lg font-bold text-amber-400">
                      {/* {category.type === 'follow'
                        ? '150+'
                        : // : category.type === 'watch'
                        // ? '200+'
                        '120+'}{' '}
                      Coins */}
                      100+
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span>Click to view</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </DashboardGlassCard>
          );
        })}
      </div>

      {/* Rejected Tasks Section */}
      {/* {rejectedTasks.length > 0 ? (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">Rejected Tasks</h3>
              <p className="text-zinc-400">Review and retry these tasks</p>
            </div>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
              {rejectedTasks.length} tasks need attention
            </span>
          </div>

          <div className="space-y-4">
            {rejectedTasks.slice(0, 3).map((task) => {
              const platformInfo = allPlatforms.find(
                (p) => p.platform === task.platform
              );
              return (
                <DashboardGlassCard key={task.id} hover>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-div-to-br ${platformInfo?.gradient} flex items-center justify-center shrink`}
                        >
                          {platformInfo?.icon &&
                            React.createElement(platformInfo.icon, {
                              size: 20,
                              className: platformInfo.color,
                            })}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white mb-2">
                            {task.title}
                          </h4>
                          <p className="text-sm text-zinc-400 mb-2">
                            {task.desc}
                          </p>
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-400" />
                            <p className="text-sm text-red-400">
                              {task.rejectionReason}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Coins size={20} className="text-amber-400" />
                          <span className="text-xl font-bold text-amber-400">
                            +100
                          </span>
                        </div>

                        <MagneticButton
                          small
                          onClick={() => setReviewingRejectedTask(task)}
                          className="px-6!"
                        >
                          <RefreshCw size={16} />
                          Review
                        </MagneticButton>
                      </div>
                    </div>
                  </div>
                </DashboardGlassCard>
              );
            })}

            {rejectedTasks.length > 3 && (
              <div className="text-center">
                <button
                  onClick={() => setDashView('tasks')}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  View all {rejectedTasks.length} rejected tasks →
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <DashboardGlassCard className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              All Clear! 🎉
            </h3>
            <p className="text-zinc-400 mb-2">
              You don't have any rejected tasks at the moment.
            </p>
            <p className="text-sm text-zinc-500">
              Keep up the great work! Complete more tasks to earn coins.
            </p>
          </DashboardGlassCard>
        </div>
      )} */}
    </div>
  );
};
