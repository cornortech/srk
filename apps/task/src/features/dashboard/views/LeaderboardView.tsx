import React, { useState } from 'react';
import { Clock, Coins, Medal, Search, Trophy } from 'lucide-react';
import { api } from '../../../lib/api';
import { LeaderboardEntry } from '../types';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';

const RANGES = ['weekly', 'monthly', 'allTime'] as const;
type Range = (typeof RANGES)[number];

const RANGE_LABELS: Record<Range, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  allTime: 'All time',
};

const rankMedal = (rank: number) => {
  if (rank === 1) return <Medal size={14} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={14} className="text-white/50" />;
  if (rank === 3) return <Medal size={14} className="text-amber-600" />;
  return null;
};

export const LeaderboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<Range>('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const { taskUserID } = useTaskAuthStore();

  const { data: leaderboardRes } =
    api.srkTask.getAllSrkTaskUserEarningsLeaderboard.useQuery(
      ['getTaskUserLeaderboard', timeRange, searchQuery, taskUserID],
      {
        query: {
          timeRange: timeRange === 'allTime' ? 'all' : timeRange,
          search: searchQuery || undefined,
          currentUserId: taskUserID || undefined,
        },
      }
    );

  const entries: LeaderboardEntry[] =
    leaderboardRes?.status === 200 && leaderboardRes.body.data
      ? leaderboardRes.body.data.leaderboard.map((entry) => ({
          rank: entry.rank,
          user: entry.fullName,
          score: entry.coins,
          consistencyDays: entry.consistencyDays,
          isSelf: !!(
            leaderboardRes.body.data.currentUser &&
            entry.rank === leaderboardRes.body.data.currentUser.rank
          ),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName)}&background=1a1a1a&color=b68938&bold=true`,
          change:
            entry.change > 0 ? 'up' : entry.change < 0 ? 'down' : 'stable',
          changeAmount: Math.abs(entry.change),
        }))
      : [];

  const currentUserStats =
    leaderboardRes?.status === 200
      ? leaderboardRes.body.data.currentUser
      : null;

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-2">
            Rankings
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Leaderboard
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Top performers and your current ranking
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-transparent border border-white/[0.1] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/40 transition-colors w-48"
            />
          </div>

          {/* Range selector */}
          <div className="flex border border-white/[0.08]">
            {RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-xs font-medium transition-colors duration-150 border-r border-white/[0.08] last:border-r-0 ${
                  timeRange === range
                    ? 'bg-primary/10 text-primary'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                }`}
              >
                {RANGE_LABELS[range]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 — compact row */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
          {entries.slice(0, 3).map((user, i) => (
            <div
              key={user.rank}
              className={`bg-bgPrimary p-5 flex flex-col items-center text-center ${
                user.isSelf ? 'border-l-2 border-primary' : ''
              }`}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-xs font-mono text-white/30 tabular-nums">
                  #{user.rank}
                </span>
                {rankMedal(user.rank)}
              </div>
              <img
                src={user.avatar}
                alt={user.user}
                className="w-10 h-10 mb-3 border border-white/[0.08]"
              />
              <p className={`text-sm font-semibold mb-0.5 truncate w-full ${user.isSelf ? 'text-primary' : 'text-white/90'}`}>
                {user.user}
                {user.isSelf && <span className="text-[10px] text-primary/60 ml-1">(you)</span>}
              </p>
              <p className="text-lg font-semibold text-white tabular-nums">
                {user.score.toLocaleString()}
                <span className="text-xs text-white/30 font-normal ml-1">coins</span>
              </p>
              <p className="text-xs text-white/30 mt-1">
                {user.consistencyDays}d streak
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Full table */}
      <div className="border border-white/[0.08]">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-xs font-medium text-white/50 uppercase tracking-widest">
            Full rankings
          </h2>
          {entries.length > 0 && (
            <span className="text-xs text-white/25">{entries.length} entries</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Rank', 'User', 'Coins', 'Streak', 'Change'].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-5 text-[10px] font-medium uppercase tracking-widest text-white/30"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {entries.map((user) => (
                <tr
                  key={user.rank}
                  className={`hover:bg-white/[0.02] transition-colors duration-100 ${
                    user.isSelf ? 'border-l-2 border-primary bg-primary/[0.03]' : ''
                  }`}
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-white/40 tabular-nums w-6">
                        {user.rank}
                      </span>
                      {rankMedal(user.rank)}
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.user}
                        className="w-7 h-7 border border-white/[0.08] flex-shrink-0"
                      />
                      <div>
                        <p className={`text-sm font-medium ${user.isSelf ? 'text-primary' : 'text-white/85'}`}>
                          {user.user}
                        </p>
                        {user.isSelf && (
                          <span className="text-[10px] text-primary/50">you</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1.5">
                      <Coins size={13} className="text-primary flex-shrink-0" />
                      <span className="text-sm font-semibold text-white tabular-nums">
                        {user.score.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-white/30 flex-shrink-0" />
                      <span className="text-sm text-white/55 tabular-nums">
                        {user.consistencyDays}d
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    {user.change && user.change !== 'stable' && (
                      <span
                        className={`text-xs font-medium tabular-nums ${
                          user.change === 'up' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {user.change === 'up' ? '↑' : '↓'} {user.changeAmount || ''}
                      </span>
                    )}
                    {user.change === 'stable' && (
                      <span className="text-xs text-white/20">—</span>
                    )}
                  </td>
                </tr>
              ))}

              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-white/25">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Your position callout */}
      {currentUserStats && (
        <div className="border border-primary/20 bg-primary/[0.04] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy size={16} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Your position</p>
              <p className="text-xs text-white/40 mt-0.5">
                Keep completing tasks to climb higher
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-primary tabular-nums">
              #{currentUserStats.rank}
            </p>
            <p className="text-xs text-white/35 tabular-nums">
              {currentUserStats.coins.toLocaleString()} coins
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
