import { useState } from 'react';
import { leaderboardData } from '../data/dummyDashboardData';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { Award, Clock, Coins, Search, TrendingUp, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';

export const LeaderboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'allTime'>(
    'weekly'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = leaderboardData.filter((user) =>
    user.user.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <DashboardGradientText>Leaderboard</DashboardGradientText>
          </h1>
          <p className="text-zinc-400">Top performers and your ranking</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex gap-2">
            {(['weekly', 'monthly', 'allTime'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-div-to-r from-amber-500/20 to-yellow-500/20 text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {filteredData.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.rank}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex flex-col items-center ${
              index === 1 ? '-mt-8' : ''
            }`}
          >
            {/* Rank Badge */}
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                index === 0
                  ? 'bg-div-to-r from-yellow-500 to-amber-500'
                  : index === 1
                  ? 'bg-div-to-r from-zinc-400 to-zinc-300'
                  : 'bg-div-to-r from-amber-700 to-orange-600'
              }`}
            >
              <span className="text-2xl font-bold text-white">
                #{user.rank}
              </span>
            </div>

            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-24 h-24 rounded-full border-4 mb-4 overflow-hidden ${
                index === 0
                  ? 'border-yellow-500'
                  : index === 1
                  ? 'border-zinc-400'
                  : 'border-amber-700'
              } ${user.isSelf ? 'ring-4 ring-purple-500/50' : ''}`}
            >
              <img
                src={user.avatar}
                alt={user.user}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* User Info */}
            <div
              className={`text-center px-6 py-4 rounded-xl w-full ${
                index === 0
                  ? 'bg-div-to-r from-yellow-500/20 to-amber-500/20'
                  : index === 1
                  ? 'bg-div-to-r from-zinc-500/20 to-zinc-400/20'
                  : 'bg-div-to-r from-amber-700/20 to-orange-700/20'
              }`}
            >
              <p className="font-bold text-white text-lg mb-1">{user.user}</p>
              {user.isSelf && (
                <span className="text-xs text-purple-400 font-medium mb-2">
                  YOU
                </span>
              )}
              <p className="text-3xl font-bold mt-2 mb-1">
                {user.score.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp size={12} className="text-green-400" />
                <span className="text-xs text-zinc-400">
                  {user.consistencyDays} days
                </span>
              </div>

              {/* Rank Change */}
              {user.change && (
                <div
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs mt-2 ${
                    user.change === 'up'
                      ? 'bg-green-500/20 text-green-400'
                      : user.change === 'down'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-zinc-500/20 text-zinc-400'
                  }`}
                >
                  {user.change === 'up'
                    ? '↑'
                    : user.change === 'down'
                    ? '↓'
                    : '→'}
                  {user.changeAmount || ''}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Rest of leaderboard */}
      <DashboardGlassCard>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Rank
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Score
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Consistency
                  </th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-medium">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(3).map((user) => (
                  <motion.tr
                    key={user.rank}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/5 ${
                      user.isSelf
                        ? 'bg-div-to-r from-purple-500/10 to-pink-500/10'
                        : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 font-bold">
                          #{user.rank}
                        </span>
                        {user.rank <= 3 && (
                          <Award
                            size={16}
                            className={
                              user.rank === 1
                                ? 'text-yellow-500'
                                : user.rank === 2
                                ? 'text-zinc-400'
                                : 'text-amber-700'
                            }
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p
                            className={`font-medium ${
                              user.isSelf ? 'text-purple-400' : 'text-white'
                            }`}
                          >
                            {user.user}
                          </p>
                          {user.isSelf && (
                            <span className="text-xs text-purple-400">You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Coins size={16} className="text-amber-400" />
                        <span className="font-bold text-white">
                          {user.score.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-400" />
                        <span className="text-zinc-300">
                          {user.consistencyDays} days
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {user.change && (
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                            user.change === 'up'
                              ? 'bg-green-500/20 text-green-400'
                              : user.change === 'down'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-zinc-500/20 text-zinc-400'
                          }`}
                        >
                          {user.change === 'up'
                            ? '↑'
                            : user.change === 'down'
                            ? '↓'
                            : '→'}
                          {user.changeAmount || ''}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Your Position */}
          {leaderboardData.find((u) => u.isSelf) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-div-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-purple-400" />
                  <div>
                    <p className="font-bold text-white">Your Position</p>
                    <p className="text-sm text-zinc-400">
                      Keep earning to climb higher!
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-400">
                    #{leaderboardData.find((u) => u.isSelf)?.rank}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {leaderboardData
                      .find((u) => u.isSelf)
                      ?.score.toLocaleString()}{' '}
                    points
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DashboardGlassCard>
    </div>
  );
};
