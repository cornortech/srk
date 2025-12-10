import { DashboardData, PlatformTasks } from 'apps/grow/src/lib/types/admin';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { THEME } from '../constants/theme';

interface TaskMonitoringViewProps {
  data: DashboardData;
}

export const TaskMonitoringView: React.FC<TaskMonitoringViewProps> = ({
  data,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    data.taskMonitoringData.length > 0
      ? data.taskMonitoringData[0].userId
      : null
  );
  const [activePlatform, setActivePlatform] = useState<
    'facebook' | 'youtube' | 'instagram' | 'twitter' | 'tiktok'
  >('facebook');
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});

  const usersWithTasks = useMemo(() => {
    return data.allUsers
      .filter((u) => data.taskMonitoringData.some((t) => t.userId === u.id))
      .map((user) => {
        const taskData = data.taskMonitoringData.find(
          (t) => t.userId === user.id
        )!;
        const platforms = Object.values(taskData.platforms);

        let totalRequired = 0;
        let totalCompleted = 0;

        platforms.forEach((p) => {
          (Object.keys(p) as Array<keyof PlatformTasks>).forEach((taskKey) => {
            totalRequired += p[taskKey].total;
            totalCompleted += p[taskKey].completed;
          });
        });

        const completionPercentage =
          totalRequired > 0
            ? Math.round((totalCompleted / totalRequired) * 100)
            : 0;

        return {
          ...user,
          status: userStatuses[user.id] || user.status,
          completionPercentage,
          taskData,
        };
      })
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.completionPercentage - a.completionPercentage);
  }, [data.allUsers, data.taskMonitoringData, userStatuses, searchQuery]);

  useEffect(() => {
    if (
      !usersWithTasks.find((u) => u.id === selectedUserId) &&
      usersWithTasks.length > 0
    ) {
      setSelectedUserId(usersWithTasks[0].id);
    }
  }, [usersWithTasks, selectedUserId]);

  const currentUser = usersWithTasks.find((u) => u.id === selectedUserId);
  const platformTasks = currentUser?.taskData?.platforms[activePlatform];

  const handleTimeoutPackage = useCallback(() => {
    if (!currentUser) return;
    const isConfirmed = window.confirm(
      `Confirm TIMEOUT for ${currentUser.name} (${currentUser.id})? This will suspend earnings for 7 days.`
    );
    if (isConfirmed) {
      setUserStatuses((prev) => ({
        ...prev,
        [currentUser.id]: 'Package Timed Out',
      }));
    }
  }, [currentUser]);

  const platforms = useMemo(
    () => [
      {
        id: 'facebook' as const,
        label: 'Facebook',
        color: '#1877F2',
        icon: '📘',
      },
      {
        id: 'youtube' as const,
        label: 'YouTube',
        color: '#FF0000',
        icon: '📺',
      },
      {
        id: 'instagram' as const,
        label: 'Instagram',
        color: '#C13584',
        icon: '📷',
      },
      {
        id: 'twitter' as const,
        label: 'Twitter',
        color: '#1DA1F2',
        icon: '🐦',
      },
      { id: 'tiktok' as const, label: 'TikTok', color: '#69C9D0', icon: '🎵' },
    ],
    []
  );

  const taskCategories = useMemo(
    () => [
      { id: 'follow' as const, label: 'Follow Task' },
      { id: 'video' as const, label: 'Video View' },
      { id: 'post' as const, label: 'Post/Content Share' },
    ],
    []
  );

  const handlePlatformSelect = useCallback(
    (platformId: typeof activePlatform) => {
      setActivePlatform(platformId);
    },
    []
  );

  const handleUserSelect = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Task Monitoring</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Track and manage affiliate task completion
        </p>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Search Affiliates
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <span className="text-gray-500">🔍</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Select Affiliate ({usersWithTasks.length})
                  </label>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {usersWithTasks.map((user, index) => (
                      <motion.button
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                          selectedUserId === user.id
                            ? 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 shadow-lg'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-white group-hover:text-[#e1ba73] transition-colors">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-400">{user.id}</p>
                          </div>
                          <div className="text-right">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="text-xl font-bold text-white"
                            >
                              {user.completionPercentage}%
                            </motion.div>
                            <StatusBadge status={user.status} />
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${user.completionPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-2 rounded-full"
                            style={{ background: THEME.colors.goldGradient }}
                          />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {currentUser ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <motion.h2
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-bold text-white"
                      >
                        {currentUser.name}
                      </motion.h2>
                      <div className="flex items-center gap-3 mt-2">
                        <StatusBadge status={currentUser.status} />
                        <span className="text-gray-400">
                          {currentUser.package}
                        </span>
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className="text-white font-bold bg-gradient-to-r from-[#b68938]/20 to-[#e1ba73]/20 px-3 py-1 rounded-full"
                        >
                          ₹{currentUser.balance.toFixed(2)}
                        </motion.span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTimeoutPackage}
                      className="px-4 py-2 bg-gradient-to-r from-rose-600/20 to-rose-700/20 text-rose-300 border border-rose-600/30 rounded-lg hover:bg-rose-600/30 transition-colors flex items-center gap-2 text-sm"
                    >
                      <span>⏱️</span>
                      Timeout Package
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <motion.button
                        key={platform.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlatformSelect(platform.id)}
                        className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                          activePlatform === platform.id
                            ? 'bg-white/10 text-white shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{platform.icon}</span>
                        <span className="font-medium">{platform.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {taskCategories.map((category) => {
                      const tasks = platformTasks?.[category.id];
                      if (!tasks || tasks.status === 'N/A') return null;

                      const percent =
                        tasks.total > 0
                          ? Math.round((tasks.completed / tasks.total) * 100)
                          : 0;
                      const platform = platforms.find(
                        (p) => p.id === activePlatform
                      );

                      return (
                        <GlassCard key={category.id} hover>
                          <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {category.label}
                                </span>
                              </div>
                              <motion.span
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="text-2xl font-bold"
                                style={{ color: platform?.color }}
                              >
                                {percent}%
                              </motion.span>
                            </div>

                            <div className="space-y-2">
                              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ duration: 1 }}
                                  className="h-2 rounded-full"
                                  style={{ backgroundColor: platform?.color }}
                                />
                              </div>
                              <div className="flex justify-between text-sm text-gray-400">
                                <span>
                                  {tasks.completed}/{tasks.total} tasks
                                </span>
                                <StatusBadge status={tasks.status} />
                              </div>
                            </div>

                            {tasks.link && (
                              <a
                                href={`https://${tasks.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-blue-400 hover:text-blue-300 truncate hover:underline"
                              >
                                🔗 {tasks.link}
                              </a>
                            )}
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-400">
                    Select an affiliate to view task details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
