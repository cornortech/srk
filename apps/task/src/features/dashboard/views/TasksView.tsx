import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronRight,
  Coins,
  Play,
  RefreshCw,
  Share2,
  Shield,
  Users,
} from 'lucide-react';
import {
  allPlatforms,
  followTasks,
  likeTasks,
} from '../../../data/dummyDashboardMockData';
import {
  DashboardView,
  RejectedTaskEntry,
  SocialPlatform,
  Task,
  TaskType,
} from '../types';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import MagneticButton from '../components/ui/DashboardMagneticButton';
import DashboardGradientText from '../components/ui/DashboardGradientText';

interface TasksViewProps {
  isApproved: boolean;
  setDashView: (view: DashboardView) => void;
  rejectedTasks: RejectedTaskEntry[];
  setTaskCategory: (type: TaskType) => void;
  setReviewingRejectedTask: (task: RejectedTaskEntry) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  isApproved,
  setDashView,
  rejectedTasks,
  setTaskCategory,
  setReviewingRejectedTask,
}) => {
  const [showVideoFeature, setShowVideoFeature] = useState(false);
  if (false) {
    setShowVideoFeature(false);
  }

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

      {/* Video Feature Toggle */}
      <div className="flex justify-end"></div>

      {/* Video Feature Section */}
      {showVideoFeature && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        ></motion.div>
      )}

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
              hover
              gradient={
                category.type === 'follow'
                  ? 'green'
                  : // : category.type === 'watch'
                    // ? 'blue'
                    'purple'
              }
              onClick={() => setTaskCategory(category.type)}
              className="cursor-pointer"
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
                      {category.type === 'follow'
                        ? '150+'
                        : // : category.type === 'watch'
                          // ? '200+'
                          '120+'}{' '}
                      Coins
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
      {rejectedTasks.length > 0 && (
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
                            +{task.coins}
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
      )}
    </div>
  );
};
