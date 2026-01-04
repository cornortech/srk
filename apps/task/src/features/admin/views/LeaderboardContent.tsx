import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Search,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  User,
} from 'lucide-react';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';
import { api } from '../../../lib/api';

export const LeaderboardContent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'all'>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch leaderboard data
  const queryResult = api.srkTask.getAllSrkTaskUserEarningsLeaderboard.useQuery(
    ['admin-leaderboard', page, timeRange, debouncedSearch],
    {
      query: {
        page: page.toString(),
        limit: '20',
        timeRange,
        search: debouncedSearch || undefined,
      },
    }
  );

  const { data, isLoading, error } = queryResult;

  const leaderboardData = data?.body?.data?.leaderboard || [];
  const totalPages = data?.body?.totalPages || 1;
  const totalRecords = data?.body?.totalRecords || 0;

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1)
      return 'bg-[#FFD700] text-black shadow-[0_0_15px_#FFD700] scale-110';
    if (rank === 2) return 'bg-[#C0C0C0] text-black scale-105';
    if (rank === 3) return 'bg-[#CD7F32] text-black';
    return 'bg-gray-700 text-white';
  };

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1BA73] mx-auto"></div>
        <p className="mt-4">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-400">
        Error loading leaderboard. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E1BA73]/30 pb-4">
        <div className="flex items-center gap-3">
          <Trophy size={28} className="text-[#E1BA73]" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Top Performers
            </h2>
            <p className="text-sm text-gray-400">
              Total: {totalRecords} users
            </p>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex gap-2">
          {(['weekly', 'monthly', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold uppercase transition-colors ${
                timeRange === range
                  ? 'bg-[#E1BA73] text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E1BA73] transition-colors"
        />
      </div>

      {/* Leaderboard List */}
      {leaderboardData.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          No users found in leaderboard.
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboardData.map((user) => (
            <motion.div
              key={user.userId}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#E1BA73]/50 transition-colors"
              style={{ background: CARD_BG }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: user.rank * 0.02 }}
            >
              {/* Rank Badge */}
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-extrabold text-base sm:text-lg flex-shrink-0 ${getRankBadgeStyle(
                  user.rank
                )}`}
              >
                {user.rank}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg sm:text-xl font-bold text-white truncate">
                    {user.fullName}
                  </p>
                  {user.isActivated ? (
                    <div title="Activated">
                      <CheckCircle
                        size={18}
                        className="text-green-400 flex-shrink-0"
                      />
                    </div>
                  ) : (
                    <div title="Not Activated">
                      <XCircle
                        size={18}
                        className="text-red-400 flex-shrink-0"
                      />
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-gray-500" />
                    <span className="truncate">ID: {user.userId.slice(-8)}</span>
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="text-gray-500" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-500" />
                    <span>{user.consistencyDays} days active</span>
                  </div>
                </div>
              </div>

              {/* Coins Display */}
              <div className="text-right flex-shrink-0">
                <p
                  className="text-2xl sm:text-3xl font-extrabold"
                  style={{ color: GOLD_PRIMARY }}
                >
                  {user.coins.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Coins Earned
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
