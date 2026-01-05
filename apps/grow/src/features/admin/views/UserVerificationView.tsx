import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RejectionModal } from '../Modals/RejectionModal';
import { UserDetailsModal } from '../Modals/UserDetailsModal';
import { api } from '../../../lib/api';
import moment from 'moment';
import { useSRKAlert } from '@srk/shared/hooks';
import TablePagination from '../../../lib/ui/TablePagination';
import { Eye } from 'lucide-react';

export const UserVerificationView = () => {
  const [page, setPage] = useState(1);

  const { data: growEnrollementUserData } =
    api.grow.getAllGrowSocialMediaEnrollement.useQuery(
      ['enrolledUser', page], // queryKey
      {
        query: {
          page: page,
          limit: 10,
        },
      }
    );
  
  // Update these variables:
const totalPage = growEnrollementUserData?.body?.totalPages ?? 1;

  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState<typeof growEnrollementUserData extends { body: { data: Array<infer T> } } ? T : never | null>(null);

  const { show } = useSRKAlert();

  const { mutate: acceptEnrollementMutation, isPending: approvePending } =
    api.grow.acceptSocialGrowEnrollmentRequest.useMutation({
      onSuccess: (res) => {
        if (res.status === 200) {
          show('Enrollement User approved', 'success');
        }
      },
    });

  const handleApprove = (id: string) => {
    setSelectedItemId(id);
    acceptEnrollementMutation({
      params: {
        enrollmentId: id,
      },
    });
  };

  const { mutate: rejectEnrollementMutation, isPending: rejectPending } =
    api.grow.rejectSocialGrowEnrollmentRequest.useMutation({
      onSuccess: (res) => {
        if (res.status === 200) {
          show('Enrollement User rejected', 'success');
        }
      },
    });

  const handleReject = (id: string) => {
    setSelectedItemId(id);
    setRejectionModalOpen(true);
  };

  const handleRejectionSubmit = (rejectionReason: string) => {
    if (selectedItemId) {
      rejectEnrollementMutation({
        params: {
          enrollmentId: selectedItemId,
        },
        body: {
          rejectionReason: rejectionReason,
        },
      });
    }
  };

  const handleViewDetails = (item: NonNullable<typeof growEnrollementUserData>['body']['data'][number]) => {
    setSelectedUserData(item);
    setUserDetailsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>User Verification</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Review and verify user KYC documents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending KYC</p>
                <p className="text-3xl font-bold text-amber-400">{0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Verified Users</p>
                <p className="text-3xl font-bold text-emerald-400">{0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Rejected KYC</p>
                <p className="text-3xl font-bold text-rose-400">{0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">
                User KYC Verification
              </h3>
              <p className="text-gray-400 text-sm">{0} users found</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400 text-xs">▼</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    S.N.
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    User Details
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    Package
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    Submitted Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {growEnrollementUserData?.body.data?.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                        {index + 1 + (page - 1) * 10}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-white">
                          {item.userData.fullName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {item.userData.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium text-sm">
                          {item.enrollmentData.packageName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.enrollmentData.socialMediaPlatform}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white text-sm">
                        {moment(item.createdAt).format('ll')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {moment(item.createdAt).format('LT')}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={item.userData.status} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetails(item)}
                          className="p-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </motion.button>
                        {item.userData.status === 'verificationPending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(item._id)}
                              disabled={approvePending}
                              className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-xs font-medium disabled:opacity-50"
                            >
                              {approvePending && selectedItemId === item._id ? '...' : '✓'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(item._id)}
                              className="px-3 py-1 bg-rose-600/20 text-rose-300 rounded-lg hover:bg-rose-600/30 transition-colors text-xs font-medium"
                            >
                              ✕
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      {totalPage > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPage}
          onPageChange={setPage}
        />
      )}

      <AnimatePresence>
        {userDetailsModalOpen && (
          <UserDetailsModal
            isOpen={userDetailsModalOpen}
            onClose={() => setUserDetailsModalOpen(false)}
            userData={selectedUserData}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectionModalOpen && (
          <RejectionModal
            isRejecting={rejectPending}
            isOpen={rejectionModalOpen}
            onClose={() => setRejectionModalOpen(false)}
            onSubmit={handleRejectionSubmit}
            title="Reject User Verification"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};