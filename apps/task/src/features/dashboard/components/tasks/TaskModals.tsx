import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coins, ThumbsUp, Users, X } from 'lucide-react';

import { allPlatforms } from '../../../../data/dummyDashboardMockData';
import { SocialPlatform, Task, TaskType } from '../../types';
import { DashboardGlassCard } from '../ui/DashboardGlassCard';
import MagneticButton from '../ui/DashboardMagneticButton';
import { api } from '../../../../lib/api';
import { useTaskAuthStore } from '../../../../store/useTaskAuthStore';

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
  <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-sm overflow-y-auto">
    <DashboardGlassCard className="w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden p-4 sm:p-8 relative flex flex-col">
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {allPlatforms.map((p) => {
            const Icon = p.icon;
            // const taskCount =
            //   type === 'follow'
            //     ? followTasks.filter((t) => t.platform === p.platform).length
            //     : likeTasks.filter((t) => t.platform === p.platform).length;

            return (
              <DashboardGlassCard
                key={p.platform}
                hover
                onClick={() => {
                  setSelectedPlatform(p.platform);
                }}
                className="cursor-pointer"
              >
                <div className="p-4 sm:p-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br ${p.gradient}`}
                  >
                    <Icon
                      size={28}
                      className={
                        p.platform === 'TikTok' ? 'text-white' : p.color
                      }
                    />
                  </motion.div>
                  <p className="font-semibold text-white mb-1">{p.name}</p>
                  {/* <p className="text-sm text-zinc-400">{taskCount} tasks</p> */}
                </div>
              </DashboardGlassCard>
            );
          })}
        </div>
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
  const { taskUserID } = useTaskAuthStore();

  const { data: tasksRes, isLoading } =
    api.srkTask.getSrkTaskActionsByPlatforms.useQuery(
      ['getSrkTaskActionsByPlatforms', platform, type, taskUserID],
      {
        query: {
          platform,
          type: type === 'follow' ? 'follow' : 'like',
          srkTaskUserId: taskUserID || '',
          page: '1',
          limit: '50',
        },
      }
    );

  const realTasks: Task[] =
    tasksRes?.status === 200 && tasksRes.body.data
      ? tasksRes.body.data
          .filter((item: any) => item?.socialMediaPlatform && item?.taskType)
          .map((item: any) => ({
            id: item.actionId || '',
            title:
              item.taskType === 'follow'
                ? `Follow ${item.username || 'User'}`
                : `Like Post`,
            desc: `${item.socialMediaPlatform} ${item.taskType} Task`,
            platform: item.socialMediaPlatform.toLowerCase() as SocialPlatform,
            type: item.taskType as TaskType,
            coins: 100, // Hardcoded as per instruction
            username: item.username || '',
            url: item.postUrl || item.profileLinkURL || '',
            required: 'Screenshot Proof',
            status: 'pending',
            completed: false,
          }))
      : [];

  const tasks = realTasks;

  const platformInfo = allPlatforms.find((p) => p.platform === platform);
  const Icon = platformInfo?.icon;

  const handleTaskClick = (task: Task) => {
    // if (task.type === 'watch') {
    //   setPlayingVideo(task);
    // } else {
    setVerifyingTask(task);
    // }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
      <DashboardGlassCard className="w-full max-w-4xl max-h-[90vh] overflow-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute -top-6 -right-3 sm:top-6 sm:right-6
           p-2 hover:bg-white/10 rounded-lg"
        >
          <X size={20} />
        </button>

        <button
          onClick={onBack}
          className="absolute -top-6 -left-3 sm:top-6 sm:left-6
           p-2 text-zinc-400 hover:text-white
           flex items-center gap-1"
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
              <h2 className="text-xl sm:text-3xl font-bold text-white">
                {platformInfo?.name}{' '}
                {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} Tasks
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                {isLoading ? 'Loading...' : `${tasks.length} available tasks`}
              </p>
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
                  <div
                    className="flex flex-col lg:flex-row
                items-start lg:items-center
                justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* {task.type === 'watch' ? (
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
                      ) :  */}
                      {/* ( */}
                      <div className="w-12 h-12 rounded-xl bg-div-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center shrink">
                        {task.type === 'follow' ? (
                          <Users size={20} className="text-amber-400" />
                        ) : (
                          <ThumbsUp size={20} className="text-amber-400" />
                        )}
                      </div>
                      {/* )} */}

                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-white mb-2">
                          {task.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-400 mb-2">
                          {task.desc}
                        </p>
                        {task.username && (
                          <p className="text-xs sm:text-sm text-zinc-500">
                            Account: {task.username}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm text-red-400 mt-2">
                          Needed : {task.required}
                        </p>
                        <div className="mt-4">
                          <a
                            href={task.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xs text-yellow-400 underline mt-2 break-all max-w-full"
                          >
                            {task.url}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex flex-col sm:flex-row
                w-full lg:w-auto
                items-start sm:items-center
                gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <Coins size={20} className="text-amber-400" />
                        <span className="text-xl font-bold text-amber-400">
                          +{task.coins}
                        </span>
                      </div>

                      <MagneticButton
                        small
                        onClick={() => handleTaskClick(task)}
                        className="w-full sm:w-auto px-6!"
                      >
                        {/* {task.type === 'watch' ? 'Watch Video' :  */}
                        Start Task
                        {/* '} */}
                      </MagneticButton>
                    </div>
                  </div>
                </DashboardGlassCard>
              </motion.div>
            ))
          ) : (
            <div className="text-center p-6 sm:p-10 bg-white/5 rounded-xl">
              <p className="text-lg font-semibold text-zinc-400">
                {isLoading
                  ? 'Loading tasks...'
                  : `No ${type} tasks available for ${platformInfo?.name}`}
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
