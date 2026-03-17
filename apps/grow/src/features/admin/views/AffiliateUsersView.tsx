import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../../../lib/api';
import { X, ChevronLeft, ChevronRight, Wallet, Users } from 'lucide-react';
import { format } from 'date-fns';

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ userId, onClose }) => {
  const { data: affiliateData, isLoading } = api.grow.getGrowAffiliateUser.useQuery(
    ['growAffiliateUser', userId],
    { params: { userId } },
    {
      queryKey: ['growAffiliateUser', userId],
      enabled: !!userId,
    }
  );

  const user = affiliateData?.status === 200 ? affiliateData.body : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1a1410] to-black border border-white/10 rounded-3xl p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b68938]"></div>
              <p className="text-gray-400 mt-4">Loading user details...</p>
            </div>
          ) : !user ? (
            <div className="text-center py-10 text-gray-400">User not found</div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  <GradientText>Affiliate User Details</GradientText>
                </h2>
                <p className="text-gray-400">Complete affiliate profile information</p>
              </div>

              {/* Personal Information */}
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Gender</p>
                    <p className="text-white font-medium">{user.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Joined Date</p>
                    <p className="text-white font-medium">
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm">Promo Code</p>
                    <p className="text-[#e1ba73] font-medium font-mono text-lg">
                      {user.promocode}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Financial Overview */}
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Financial Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Wallet Balance</p>
                    <p className="text-[#e1ba73] text-2xl font-bold">₹{user.walletBalance}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Total Earnings</p>
                    <p className="text-green-400 text-2xl font-bold">₹{user.totalEarnings}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Total Payouts</p>
                    <p className="text-blue-400 text-2xl font-bold">₹{user.totalPayouts}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Pending Payouts</p>
                    <p className="text-yellow-400 text-2xl font-bold">₹{user.pendingPayouts}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Referral Statistics */}
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Referral Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Total Referrals</p>
                    <p className="text-[#e1ba73] text-3xl font-bold">
                      {user.totalReferrals}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Active Referrals</p>
                    <p className="text-green-400 text-3xl font-bold">
                      {user.activeReferrals}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Inactive Referrals</p>
                    <p className="text-red-400 text-3xl font-bold">
                      {user.totalReferrals - user.activeReferrals}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const AffiliateUsersView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const limit = 10;

  const { data: usersData, isLoading } = api.grow.getAllSrkGrowAffiliateUsers.useQuery(
    ['grow-affiliate-users', page, search, statusFilter],
    {
      query: {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      },
    },
    {
      queryKey: ['grow-affiliate-users', page, search, statusFilter],
    }
  );

  const users = usersData?.body?.data || [];
  const totalPages = usersData?.body?.totalPages || 0;
  const total = usersData?.body?.total || 0;

  const filteredUsers = useMemo(
    () =>
      statusFilter === 'all'
        ? users
        : users.filter((user) => user.status === statusFilter),
    [users, statusFilter]
  );

  const statuses = useMemo(
    () => Array.from(new Set(users.map((u) => u.status))),
    [users]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    []
  );

  const handleStatusFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
      setPage(1);
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
                      Name
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Joined Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Wallet Balance
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Total Referrals
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Actions
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
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e1ba73] flex items-center justify-center">
                            <span className="text-black font-bold text-sm">
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.fullName}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-300">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Wallet size={16} className="text-[#e1ba73]" />
                          <span className="text-[#e1ba73] font-semibold text-lg">
                            ₹{user.walletBalance || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-400" />
                          <span className="text-white font-medium">
                            {user.totalReferrals || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedUserId(user._id)}
                          className="px-4 py-2 rounded-lg bg-[#e1ba73] text-black font-semibold hover:bg-[#d1aa63] transition-all group-hover:scale-105"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && filteredUsers.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded-lg transition-colors ${page === pageNum
                          ? 'bg-[#b68938] text-black font-bold'
                          : 'bg-white/5 text-white hover:bg-white/10'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* User Details Modal */}
      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </motion.div>
  );
};
