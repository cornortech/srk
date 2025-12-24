import { LeaderboardEntry } from 'apps/grow/src/lib/types/dashboard';
import { useMemo, useState } from 'react';
import { GOLD_ACCENT, GOLD_PRIMARY } from '../constants';
import { ShareCountIcon } from '../components/ui/DashboardIcons';
import { UserIcon } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { formatCompactRupees } from '../../../lib/utils/formatters';

interface LeaderboardViewProps {
  leaderboardData: LeaderboardEntry[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  leaderboardData,
}) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'all'>('all');

  const getSortedData = useMemo(() => {
    const sorted = [...leaderboardData].sort((a, b) => {
      switch (timeFilter) {
        case 'today':
          return b.todayEarning - a.todayEarning;
        case 'week':
          return b.weekEarning - a.weekEarning;
        default:
          return b.totalAmountEarned - a.totalAmountEarned;
      }
    });

    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [leaderboardData, timeFilter]);

  const getDisplayAmount = (entry: LeaderboardEntry) => {
    switch (timeFilter) {
      case 'today':
        return entry.todayEarning;
      case 'week':
        return entry.weekEarning;
      default:
        return entry.totalAmountEarned;
    }
  };

  const getDisplayLabel = () => {
    switch (timeFilter) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      default:
        return 'All Time';
    }
  };

  const TrendIcon = ({
    trend,
    size = 'sm',
  }: {
    trend: 'up' | 'down' | 'stable';
    size?: 'sm' | 'lg';
  }) => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div
        className={`${
          sizeClasses[size]
        } rounded-full flex items-center justify-center ${
          trend === 'up'
            ? 'bg-emerald-500/20'
            : trend === 'down'
            ? 'bg-rose-500/20'
            : 'bg-gray-500/20'
        }`}
      >
        <svg
          className={`${
            trend === 'up'
              ? 'text-emerald-400'
              : trend === 'down'
              ? 'text-rose-400'
              : 'text-gray-400'
          } ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {trend === 'up' ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 15l7-7 7 7"
            />
          ) : trend === 'down' ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M19 9l-7 7-7-7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 12h14"
            />
          )}
        </svg>
      </div>
    );
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300',
          text: 'text-black',
          border: 'border-yellow-400/50',
          shadow: 'shadow-lg shadow-yellow-500/30',
        };
      case 2:
        return {
          bg: 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200',
          text: 'text-black',
          border: 'border-gray-300/50',
          shadow: 'shadow-lg shadow-gray-500/20',
        };
      case 3:
        return {
          bg: 'bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500',
          text: 'text-white',
          border: 'border-amber-600/50',
          shadow: 'shadow-lg shadow-amber-700/20',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-800/50 to-gray-900/50',
          text: 'text-gray-300',
          border: 'border-gray-700/50',
          shadow: '',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
          <p className="text-gray-400 text-sm">
            Top performers this {timeFilter}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2">
          {(['today', 'week', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`
                relative overflow-hidden group
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300
                ${
                  timeFilter === filter
                    ? `text-black bg-gradient-to-r from-[${GOLD_PRIMARY}] to-[${GOLD_ACCENT}]`
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
            >
              {filter === 'today'
                ? 'Today'
                : filter === 'week'
                ? 'Week'
                : 'All Time'}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {getSortedData.slice(0, 3).map((entry) => {
          const rankStyle = getRankColor(entry.rank);
          return (
            <GlassCard
              key={entry.rank}
              variant={entry.rank === 1 ? 'gold' : 'neutral'}
              className="min-h-[280px]"
            >
              <div className="h-full flex flex-col items-center text-center">
                {/* Rank Badge with Glass Effect */}
                <div
                  className={`relative mb-4 ${
                    entry.rank <= 3 ? 'scale-110' : ''
                  }`}
                >
                  <div
                    className={`absolute inset-0 ${rankStyle.bg} rounded-full blur-md opacity-50`}
                  ></div>
                  <div
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center ${rankStyle.bg} ${rankStyle.border} border-2 ${rankStyle.shadow}`}
                  >
                    <span className={`font-bold text-lg ${rankStyle.text}`}>
                      #{entry.rank}
                    </span>
                  </div>
                </div>

                {/* Avatar with Glass Effect */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg"></div>
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                    style={{
                      backgroundColor: entry.avatarColor,
                      boxShadow: `0 8px 32px ${entry.avatarColor}40`,
                    }}
                  >
                    {entry.avatarText}
                  </div>
                  {entry.isCurrent && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-full border border-emerald-400/30">
                      You
                    </div>
                  )}
                </div>

                {/* User Info */}
                <h3
                  className={`font-bold text-lg mb-1 ${
                    entry.isCurrent ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {entry.username}
                </h3>

                {/* Stats */}
                <div className="mt-3 grid grid-cols-2 gap-3 w-full">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Shares</div>
                    <div className="font-bold text-white">{entry.shares}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Referrals</div>
                    <div className="font-bold text-white">
                      {entry.referralCount}
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div className="mt-auto w-full pt-4 border-t border-white/5">
                  <div
                    className="text-xl font-bold"
                    style={{ color: GOLD_PRIMARY }}
                  >
                    {formatCompactRupees(getDisplayAmount(entry))}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <TrendIcon trend={entry.trend} size="lg" />
                    <span className="text-xs text-gray-500">
                      {getDisplayLabel()}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Leaderboard List */}
      <GlassCard variant="neutral" blur="lg">
        <div className="space-y-2">
          {getSortedData.slice(3).map((entry) => {
            const rankStyle = getRankColor(entry.rank);
            return (
              <div
                key={entry.rank}
                className={`
                  relative overflow-hidden group
                  flex items-center justify-between p-4 rounded-xl transition-all duration-300
                  ${
                    entry.isCurrent
                      ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-900/5'
                      : 'hover:bg-white/5'
                  }
                  border border-transparent hover:border-white/10
                `}
              >
                {/* Background Glow Effect */}
                {entry.isCurrent && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
                )}

                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Rank */}
                  <div
                    className={`relative ${
                      entry.rank <= 10 ? 'scale-110' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${rankStyle.bg} ${rankStyle.border} border`}
                    >
                      <span className={`font-bold ${rankStyle.text}`}>
                        #{entry.rank}
                      </span>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-md"></div>
                    <div
                      className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base"
                      style={{
                        backgroundColor: entry.avatarColor,
                        boxShadow: `0 4px 20px ${entry.avatarColor}30`,
                      }}
                    >
                      {entry.avatarText}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium truncate ${
                          entry.isCurrent ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {entry.username}
                      </span>
                      {entry.isCurrent && (
                        <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-full border border-emerald-400/30">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ShareCountIcon className="w-3 h-3" />
                        <span>{entry.shares} shares</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UserIcon className="w-3 h-3" />
                        <span>{entry.referralCount} refs</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <TrendIcon trend={entry.trend} />
                  <div className="text-right">
                    <div className="font-bold text-white">
                      {formatCompactRupees(getDisplayAmount(entry))}
                    </div>
                    <p className="text-xs text-gray-500">{getDisplayLabel()}</p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
