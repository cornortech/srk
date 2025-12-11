import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coins, Play, Share2, Users, X } from 'lucide-react';

import {
  allPlatforms,
  followTasks,
  postTasks,
  watchTasks,
} from '../../../../data/dummyDashboardMockData';
import { SocialPlatform, Task, TaskType } from '../../types';
import { DashboardGlassCard } from '../ui/DashboardGlassCard';
import MagneticButton from '../ui/DashboardMagneticButton';

interface PlatformSelectorModalProps {
  type: TaskType;
  onClose: () => void;
  setSelectedPlatform: (platform: SocialPlatform) => void;
}

export const PlatformSelectorModal: React.FC<PlatformSelectorModalProps> = ({
  type,
  onClose,
  setSelectedPlatform,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
    <DashboardGlassCard className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg"
      >
        <X size={20} />
      </button>

      <h2 className="text-3xl font-bold text-white mb-6">Select Platform</h2>
      <p className="text-zinc-400 mb-8">
        Choose a platform to view available {type} tasks
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {allPlatforms.map((p) => {
          const Icon = p.icon;
          const taskCount =
            type === 'follow'
              ? followTasks.filter((t) => t.platform === p.platform).length
              : type === 'watch'
              ? watchTasks.filter((t) => t.platform === p.platform).length
              : postTasks.filter((t) => t.platform === p.platform).length;

          return (
            <DashboardGlassCard
              key={p.platform}
              hover
              onClick={() => {
                setSelectedPlatform(p.platform);
              }}
              className="cursor-pointer"
            >
              <div className="p-6 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${p.gradient}`}
                >
                  <Icon
                    size={28}
                    className={p.platform === 'tiktok' ? 'text-white' : p.color}
                  />
                </motion.div>
                <p className="font-semibold text-white mb-1">{p.name}</p>
                <p className="text-sm text-zinc-400">{taskCount} tasks</p>
              </div>
            </DashboardGlassCard>
          );
        })}
      </div>
    </DashboardGlassCard>
  </div>
);

interface PlatformSpecificTaskModalProps {
  platform: SocialPlatform;
  type: TaskType;
  onClose: () => void;
  onBack: () => void;
  setPlayingVideo: (task: Task) => void;
  setVerifyingTask: (task: Task) => void;
}

export const PlatformSpecificTaskModal: React.FC<
  PlatformSpecificTaskModalProps
> = ({
  platform,
  type,
  onClose,
  onBack,
  setPlayingVideo,
  setVerifyingTask,
}) => {
  const tasks =
    type === 'follow'
      ? followTasks.filter((t) => t.platform === platform)
      : type === 'watch'
      ? watchTasks.filter((t) => t.platform === platform)
      : postTasks.filter((t) => t.platform === platform);

  const platformInfo = allPlatforms.find((p) => p.platform === platform);
  const Icon = platformInfo?.icon;

  const handleTaskClick = (task: Task) => {
    if (task.type === 'watch') {
      setPlayingVideo(task);
    } else {
      setVerifyingTask(task);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
      <DashboardGlassCard className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg"
        >
          <X size={20} />
        </button>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 text-zinc-400 hover:text-white flex items-center gap-1"
        >
          <ArrowRight size={16} className="rotate-180" /> Back
        </button>

        <div className="text-center mt-4 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-div-to-br ${platformInfo?.gradient} flex items-center justify-center`}
            >
              {Icon &&
                React.createElement(Icon, {
                  size: 28,
                  className: platformInfo?.color,
                })}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {platformInfo?.name}{' '}
                {type.charAt(0).toUpperCase() + type.slice(1)} Tasks
              </h2>
              <p className="text-zinc-400">{tasks.length} available tasks</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <DashboardGlassCard hover className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {task.type === 'watch' ? (
                        <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink">
                          <img
                            src={`https://img.youtube.com/vi/${
                              task.embedId || 'dQw4w9WgXcQ'
                            }/hqdefault.jpg`}
                            alt={task.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play size={24} className="text-white" />
                          </div>
                          {task.duration && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                              {task.duration}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-div-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center shrink">
                          {task.type === 'follow' ? (
                            <Users size={20} className="text-amber-400" />
                          ) : (
                            <Share2 size={20} className="text-amber-400" />
                          )}
                        </div>
                      )}

                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">
                          {task.title}
                        </h4>
                        <p className="text-sm text-zinc-400 mb-2">
                          {task.desc}
                        </p>
                        {task.username && (
                          <p className="text-sm text-zinc-500">
                            Account: {task.username}
                          </p>
                        )}
                        <p className="text-xs text-amber-400 mt-2">
                          {task.required}
                        </p>
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
                        onClick={() => handleTaskClick(task)}
                        className="px-6!"
                      >
                        {task.type === 'watch' ? 'Watch Video' : 'Start Task'}
                      </MagneticButton>
                    </div>
                  </div>
                </DashboardGlassCard>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-10 bg-white/5 rounded-xl">
              <p className="text-lg font-semibold text-zinc-400">
                No {type} tasks available for {platformInfo?.name}
              </p>
              <p className="text-sm text-zinc-500 mt-2">
                Check back later for new tasks
              </p>
            </div>
          )}
        </div>
      </DashboardGlassCard>
    </div>
  );
};
