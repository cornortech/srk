import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../../../lib/api';

export const AffiliateUsersView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: usersData, isLoading } = api.grow.getAllSrkGrowUsers.useQuery(
    ['grow-affiliate-users'],
    {
      query: {
        userType: 'affiliate',
      },
    }
  );

  const users = usersData?.body || [];

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesSearch =
          user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          user._id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [users, search, statusFilter]
  );

  const statuses = useMemo(
    () => Array.from(new Set(users.map((u) => u.status))),
    [users]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleStatusFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
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
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Affiliate Users</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Manage affiliate users and their status
        </p>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b68938]/50 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="text-gray-500">🔍</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none pr-8"
                >
                  <option value="all">All Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400 text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b68938]"></div>
              <p className="text-gray-400 mt-4">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No affiliate users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      User ID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Package
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Referrer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                          {user._id}
                        </code>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-white">{user.fullName}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">
                          {user.socialMediaPackage.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.referredBy
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-gray-500/10 text-gray-300 border border-gray-500/20'
                          }`}
                        >
                          {user.referredBy || 'Self'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};
