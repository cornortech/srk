import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  ListChecks,
  CoinsIcon,
  Loader2,
  ExternalLink,
  User,
  UserCheck,
} from 'lucide-react';
import { CARD_BG, GOLD_PRIMARY, GOLD_ACCENT } from '../constants/theme';
import { api } from '../../../lib/api';
import { getTaskAssetUrl } from '../../../lib/cdn';

export const TaskDoneContent: React.FC = React.memo(() => {
  type TaskTabType = 'follow' | 'like';
  type SocialTabType = 'youtube' | 'facebook' | 'instagram' | 'twitter';

  const [taskTab, setTaskTab] = useState<TaskTabType>('follow');
  const [socialTab, setSocialTab] = useState<SocialTabType>('youtube');
  const [currentPage, setCurrentPage] = useState(1);

  const platformMap: Record<SocialTabType, string> = {
    youtube: 'YouTube',
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
  };

  const { data, isLoading, error } =
    api.srkTask.getAllCompletedSrkTaskSubmissionsForAdmin.useQuery(
      ['completedSubmissions', taskTab, platformMap[socialTab], currentPage],
      {
        query: {
          page: currentPage.toString(),
          limit: '20',
          type: taskTab,
          platform: platformMap[socialTab],
        },
      }
    );

  const socialIcons: Record<SocialTabType, React.ElementType> = {
    youtube: Youtube,
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
  };

  const SocialTabButton: React.FC<{ platform: SocialTabType }> = ({
    platform,
  }) => {
    const Icon = socialIcons[platform];
    const isSelected = socialTab === platform;

    return (
      <motion.button
        onClick={() => {
          setSocialTab(platform);
          setCurrentPage(1);
        }}
        className={`p-2 sm:p-3 rounded-xl transition-all duration-300 border ${isSelected
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
        {(['follow', 'like'] as TaskTabType[]).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => {
              setTaskTab(tab);
              setSocialTab('youtube');
              setCurrentPage(1);
            }}
            className={`flex-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold uppercase text-sm transition-colors ${taskTab === tab ? 'text-black' : 'text-gray-400 hover:text-white'
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

      <div className="flex gap-3 sm:gap-4 mb-8 flex-wrap">
        {(
          ['youtube', 'facebook', 'instagram', 'twitter'] as SocialTabType[]
        ).map((platform) => (
          <SocialTabButton key={platform} platform={platform} />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-[#E1BA73]" size={32} />
        </div>
      )}

      {error && (
        <div className="text-red-400 text-center py-8">
          Error loading completed tasks
        </div>
      )}

      <div className="space-y-4">
        {data?.body?.data && data.body.data.length > 0 ? (
          data.body.data.map((task) => (
            <div
              key={task._id}
              className="p-4 rounded-xl border border-gray-700/50"
              style={{ background: CARD_BG }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Completed By Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <UserCheck size={16} />
                    <span className="text-xs uppercase">Completed By</span>
                  </div>
                  <div className="text-white">
                    <p className="font-bold">{task.completedBy.fullName}</p>
                    <p className="text-sm text-gray-400">
                      {task.completedBy.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      {task.completedBy.phone}
                    </p>
                  </div>
                </div>

                {/* Task Owner Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <User size={16} />
                    <span className="text-xs uppercase">Task Owner</span>
                  </div>
                  {task.taskOwner ? (
                    <div className="text-white">
                      <p className="font-bold">{task.taskOwner.fullName}</p>
                      <p className="text-sm text-gray-400">
                        {task.taskOwner.email}
                      </p>
                      <p className="text-sm text-gray-400">
                        {task.taskOwner.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No owner data</p>
                  )}
                </div>
              </div>

              {/* Task Details */}
              <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <ListChecks size={14} className="text-[#E1BA73]" />
                  <span className="text-gray-400">
                    {task.type === 'follow' ? 'Followed' : 'Liked'} on{' '}
                    {task.platform}
                  </span>
                </div>

                {task.description && (
                  <p className="text-gray-300 text-sm bg-gray-800/50 p-3 rounded-lg">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {task.profileUrl && (
                    <a
                      href={task.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                      View Profile
                    </a>
                  )}

                  {task.postUrl && (
                    <a
                      href={task.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                      View Post
                    </a>
                  )}

                  {task.screenshotUrl && (
                    <a
                      href={getTaskAssetUrl(task.screenshotUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                      View Screenshot
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div className="text-xs text-gray-500">
                    Completed: {new Date(task.completedAt).toLocaleString()}
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                    style={{ background: '#333', color: GOLD_PRIMARY }}
                  >
                    <CoinsIcon size={14} />
                    {task.coinEarned}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          !isLoading && (
            <div className="text-center py-12 text-gray-500">
              No completed tasks found for {taskTab} on{' '}
              {platformMap[socialTab]}
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      {data?.body && data.body.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#E1BA73] transition-colors"
            style={{ background: CARD_BG }}
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm">
            Page {currentPage} of {data.body.totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(data.body.totalPages, prev + 1)
              )
            }
            disabled={currentPage === data.body.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#E1BA73] transition-colors"
            style={{ background: CARD_BG }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});
