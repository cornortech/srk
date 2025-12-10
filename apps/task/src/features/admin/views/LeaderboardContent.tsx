import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LeaderboardUser } from '../types';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';

interface LeaderboardContentProps {
  data: LeaderboardUser[];
}

export const LeaderboardContent: React.FC<LeaderboardContentProps> = React.memo(
  ({ data }) => {
    const sortedData = useMemo<LeaderboardUser[]>(() => {
      return [...data]
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((user, index) => ({ ...user, rank: index + 1 }));
    }, [data]);

    return (
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white border-b border-[#E1BA73]/30 pb-2">
          Top Performers by Total Points
        </h2>
        {sortedData.map((user) => (
          <motion.div
            key={user.id}
            className="flex items-center p-4 rounded-xl shadow-lg border border-gray-700/50"
            style={{ background: CARD_BG }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: user.rank * 0.05 }}
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-extrabold text-sm sm:text-base mr-3 sm:mr-4 ${
                user.rank === 1
                  ? 'bg-[#FFD700] text-black shadow-[0_0_15px_#FFD700]'
                  : user.rank === 2
                  ? 'bg-[#C0C0C0] text-black'
                  : user.rank === 3
                  ? 'bg-[#CD7F32] text-black'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {user.rank}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-lg sm:text-xl font-bold text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-400">User ID: {user.id}</p>
            </div>

            <div className="text-right">
              <p
                className="text-xl sm:text-2xl font-extrabold"
                style={{ color: GOLD_PRIMARY }}
              >
                {user.totalPoints.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Points</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
);
