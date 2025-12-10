import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  ListChecks,
  CoinsIcon,
} from 'lucide-react';
import { DUMMY_TASKS } from '../data/dummyData';
import { CompletedTask } from '../types';
import { CARD_BG, GOLD_PRIMARY, GOLD_ACCENT } from '../constants/theme';

export const TaskDoneContent: React.FC = React.memo(() => {
  type TaskTabType = 'follow' | 'watch' | 'share';
  type SocialTabType = 'youtube' | 'facebook' | 'instagram' | 'twitter';

  const [taskTab, setTaskTab] = useState<TaskTabType>('follow');
  const [socialTab, setSocialTab] = useState<SocialTabType>('youtube');

  const socialIcons: Record<SocialTabType, React.ElementType> = {
    youtube: Youtube,
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
  };

  const currentTasks = useMemo<CompletedTask[]>(() => {
    if (taskTab === 'follow') {
      return DUMMY_TASKS.follow[socialTab] || [];
    } else if (taskTab === 'watch') {
      return DUMMY_TASKS.video.watch;
    }
    return DUMMY_TASKS.share[socialTab] || [];
  }, [taskTab, socialTab]);

  const SocialTabButton: React.FC<{ platform: SocialTabType }> = ({
    platform,
  }) => {
    const Icon = socialIcons[platform];
    const isSelected = socialTab === platform;

    return (
      <motion.button
        onClick={() => setSocialTab(platform)}
        className={`p-2 sm:p-3 rounded-xl transition-all duration-300 border ${
          isSelected
            ? 'border-[#E1BA73] text-[#E1BA73] shadow-md shadow-[#E1BA73]/20'
            : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-white'
        }`}
        style={{
          background: isSelected ? 'rgba(225, 186, 115, 0.1)' : CARD_BG,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon size={20} className="sm:size-6" />
      </motion.button>
    );
  };

  return (
    <div>
      <div
        className="flex gap-3 mb-6 p-1 rounded-xl border border-gray-700/50 w-full sm:w-fit"
        style={{ background: CARD_BG }}
      >
        {(['follow', 'watch', 'share'] as TaskTabType[]).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => {
              setTaskTab(tab);
              setSocialTab('youtube');
            }}
            className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold uppercase text-sm transition-colors ${
              taskTab === tab ? 'text-black' : 'text-gray-400 hover:text-white'
            }`}
            style={
              taskTab === tab
                ? {
                    background: `linear-gradient(45deg, ${GOLD_PRIMARY}, ${GOLD_ACCENT})`,
                  }
                : {}
            }
            whileHover={{ scale: 1.05 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {(taskTab === 'follow' || taskTab === 'share') && (
        <div className="flex gap-3 sm:gap-4 mb-8 flex-wrap">
          {(
            ['youtube', 'facebook', 'instagram', 'twitter'] as SocialTabType[]
          ).map((platform) => (
            <SocialTabButton key={platform} platform={platform} />
          ))}
        </div>
      )}

      <div className="space-y-4">
        {currentTasks.length > 0 ? (
          currentTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-gray-700/50"
              style={{ background: CARD_BG }}
            >
              <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                <p className="text-white font-semibold text-base truncate">
                  {task.username} ({task.userId})
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Completed: {task.completedAt}
                </p>
                <p className="text-xs sm:text-sm mt-1 flex items-center gap-1 text-green-400">
                  <ListChecks size={14} />
                  {taskTab === 'follow'
                    ? `Followed on ${socialTab}`
                    : taskTab === 'watch'
                    ? 'Watched video'
                    : `Shared on ${socialTab}`}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1"
                  style={{ background: '#333', color: GOLD_PRIMARY }}
                >
                  <CoinsIcon size={14} />
                  {task.points}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-10 text-gray-500">
            No tasks completed for this category yet.
          </div>
        )}
      </div>
    </div>
  );
});
