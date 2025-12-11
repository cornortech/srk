import { DashboardData } from 'apps/grow/src/lib/types/admin';
import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';

interface PrivateTasksViewProps {
  data: DashboardData;
}

export const PrivateTasksView: React.FC<PrivateTasksViewProps> = ({ data }) => {
  const [sortBy, setSortBy] = useState<'total' | 'facebook' | 'youtube'>(
    'total'
  );

  const sortedData = useMemo(() => {
    return [...data.privateTaskPerformance].sort((a, b) => {
      if (sortBy === 'total') return b.totalClicks - a.totalClicks;
      if (sortBy === 'facebook') return b.facebookClicks - a.facebookClicks;
      return b.youtubeClicks - a.youtubeClicks;
    });
  }, [data.privateTaskPerformance, sortBy]);

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortBy(e.target.value as 'total' | 'facebook' | 'youtube');
    },
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            <GradientText>Private Task Performance</GradientText>
          </h1>
          <p className="text-gray-400 mt-2">
            Click analytics for private affiliate links
          </p>
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm text-gray-400">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none pr-8"
            >
              <option value="total">Total Clicks</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </motion.div>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Affiliate
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Total Clicks
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Facebook
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    YouTube
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Instagram
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((task, index) => {
                  const user = data.allUsers.find((u) => u.id === task.userId);
                  return (
                    <motion.tr
                      key={task.userId}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-white">
                            {user?.name || task.userId}
                          </p>
                          <p className="text-sm text-gray-400">{task.userId}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="text-2xl font-bold text-white"
                        >
                          {task.totalClicks.toLocaleString()}
                        </motion.div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">
                          {task.facebookClicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">
                          {task.youtubeClicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">
                          {task.instagramClicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm truncate max-w-[200px] hover:underline flex items-center gap-1"
                        >
                          <span>🔗</span>
                          {task.link}
                        </a>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};
