import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../../../lib/api';
import { X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ userId, onClose }) => {
  const { data: profileData, isLoading } = api.grow.getSrkGrowProfile.useQuery(
    ['growProfile', userId],
    { params: { userId } },
    {
      queryKey: ['growProfile', userId],
      enabled: !!userId,
    }
  );

  const user = profileData?.status === 200 ? profileData.body : null;

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
                  <GradientText>User Details</GradientText>
                </h2>
                <p className="text-gray-400">Complete profile information</p>
              </div>

              {/* Personal Information */}
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-medium">{user.userDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{user.userDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">{user.userDetails.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Country</p>
                    <p className="text-white font-medium">{user.userDetails.country || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Gender</p>
                    <p className="text-white font-medium">{user.userDetails.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <StatusBadge status={user.userDetails.status} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">User Type</p>
                    <p className="text-white font-medium capitalize">{user.userDetails.userType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Joined Date</p>
                    <p className="text-white font-medium">
                      {format(new Date(user.userDetails.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Enrollment Details */}
              {user.enrollmentData && (
                <GlassCard>
                  <h3 className="text-xl font-bold text-white mb-4">Enrollment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Package</p>
                      <p className="text-white font-medium">
                        {user.enrollmentData.enrollmentPackageDetails?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Platform</p>
                      <p className="text-white font-medium">
                        {user.enrollmentData.enrollmentPackageDetails?.socialMediaPlatform}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Package Type</p>
                      <p className="text-white font-medium">
                        {user.enrollmentData.enrollmentPackageDetails?.packageType?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Sub Type</p>
                      <p className="text-white font-medium">
                        {user.enrollmentData.enrollmentPackageDetails?.packageType?.packageSubType?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Amount</p>
                      <p className="text-white font-medium">
                        ₹{user.enrollmentData.enrollmentPackageDetails?.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Active Status</p>
                      <p className={`font-medium ${user.enrollmentData.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        {user.enrollmentData.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  {/* Analytics */}
                  {user.enrollmentData.analytics && (
                    <div className="mt-6">
                      <h4 className="text-lg font-bold text-white mb-3">Analytics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">Likes Progress</p>
                          <p className="text-[#e1ba73] text-2xl font-bold">{user.enrollmentData.analytics.likesProgress}%</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">Followers Progress</p>
                          <p className="text-[#e1ba73] text-2xl font-bold">{user.enrollmentData.analytics.followersProgress}%</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">Overall Progress</p>
                          <p className="text-[#e1ba73] text-2xl font-bold">{user.enrollmentData.analytics.overallProgress}%</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-gray-400 text-xs">Total Referrals</p>
                          <p className="text-[#e1ba73] text-2xl font-bold">{user.userDetails.totalReferrals || 0}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Payment Details */}
              {user.enrollmentData?.enrollmentPaymentDetails && (
                <GlassCard>
                  <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Transaction ID</p>
                      <p className="text-white font-medium font-mono">
                        {user.enrollmentData.enrollmentPaymentDetails.transactionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Payment Method</p>
                      <p className="text-white font-medium capitalize">
                        {user.enrollmentData.enrollmentPaymentDetails.paymentMethod}
                      </p>
                    </div>
                    {user.enrollmentData.enrollmentPaymentDetails.rejectionReason && (
                      <div className="md:col-span-2">
                        <p className="text-gray-400 text-sm">Rejection Reason</p>
                        <p className="text-red-400 font-medium">
                          {user.enrollmentData.enrollmentPaymentDetails.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* Referral Info */}
              {user.userDetails.referredBy && (
                <GlassCard>
                  <h3 className="text-xl font-bold text-white mb-4">Referral Information</h3>
                  <div>
                    <p className="text-gray-400 text-sm">Referred By</p>
                    <p className="text-white font-medium">{user.userDetails.referredBy.name}</p>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PackageUsersView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const limit = 10;

  const { data: usersData, isLoading } = api.grow.getAllSrkGrowUsers.useQuery(
    ['grow-package-users', page, search, statusFilter],
    {
      query: {
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      },
    },
    {
      queryKey: ['grow-package-users', page, search, statusFilter],
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
      setPage(1); // Reset to first page on search
    },
    []
  );

  const handleStatusFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
      setPage(1); // Reset to first page on filter change
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
          <GradientText>Package Users</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Manage package users and their status
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
              No package users found
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
                      Package
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Purpose
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Referrer
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
                        <p className="font-medium text-white">{user.fullName}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-gray-300">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">
                          {user.socialMediaPackage.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            user.enrollmentType === 'follow'
                              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                              : 'bg-pink-500/10 text-pink-300 border border-pink-500/20'
                          }`}
                        >
                          {user.enrollmentType}
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
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedUserId(user._id)}
                          className="p-2 rounded-lg bg-[#b68938]/10 text-[#e1ba73] hover:bg-[#b68938]/20 transition-colors group-hover:scale-110"
                        >
                          <Eye size={18} />
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
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          page === pageNum
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
