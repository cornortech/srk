import { DashboardData } from '../../../lib/types/admin';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DocumentViewerModal } from '../Modals/DocumentViewerModal';
import { RejectionModal } from '../Modals/RejectionModal';
import { api } from '../../../lib/api';
import moment from 'moment';
import { useSRKAlert } from '@srk/shared/hooks';
import { PostLinksModal } from '../Modals/PostLinksModal';
import TablePagination from '../../../lib/ui/TablePagination';

interface UserVerificationViewProps {
  data: DashboardData;
}

export const UserVerificationView: React.FC<UserVerificationViewProps> = () => {
  const [page, setPage] = useState(1);

  const { data: growEnrollementUserData, isLoading } =
    api.grow.getAllGrowSocialMediaEnrollement.useQuery(
      ['enrolledUser', page], // queryKey
      {
        query: {
          page: page,
          limit: 10,
        },
      }
    );


  const limit = 10;
  const totalPage = growEnrollementUserData?.body.totalPages ?? 1;

  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url?: string;
    title: string;
  } | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [postLinksModalOpen, setPostLinksModalOpen] = useState(false);
  const [selectedPostLinks, setSelectedPostLinks] = useState<string[]>([]);
  const [selectedUserName, setSelectedUserName] = useState('');

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
        enrollementId: id,
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
          enrollementId: selectedItemId,
        },
        body: {
          rejectionReason: rejectionReason,
        },
      });
    }
  };

  const handleViewPostLinks = (item: any) => {
    setSelectedPostLinks(item.postLinks || []);
    setSelectedUserName(item.fullName);
    setPostLinksModalOpen(true);
  };

  const handleViewDocuments = (item: any) => {
    const docs = item.userData.kycDocuments || [];
    const encoded = encodeURIComponent(JSON.stringify(docs));

    window.open(`/admin/view-document?data=${encoded}`, '_blank');
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
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    S.N.
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    User Details
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Submitted Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Social Links
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    View Document
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                    Amount
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
                {growEnrollementUserData?.body.data.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                        {index + 1 + (page - 1) * 10}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">
                          {item.userData.fullName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {item.userData.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">
                          {moment(item.createdAt).format('lll')}
                        </p>
                        {/* {item.reviewedAt && (
                          <p className="text-xs text-gray-400">
                            Reviewed: {item.reviewedAt}
                          </p>
                        )} */}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewPostLinks(item)}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span>👁️</span>
                        View Links ({item.userData.kycURL?.length || 0})
                      </button>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleViewDocuments(item)}
                        className="flex items-center gap-2 px-3 py-1 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span>👁️</span>
                        View KYC
                      </button>
                    </td>

                    <td className="py-4 px-6">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                        ₹{item.paymentData.transactionId}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={item.userData.status} />
                      {item.paymentData.rejectionReason && (
                        <p className="text-xs text-rose-400 mt-1 max-w-xs">
                          {item.paymentData.rejectionReason}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {item.userData.status === 'verificationPending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(item._id)}
                              disabled={approvePending}
                              className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-sm"
                            >
                              {approvePending ? 'Approving' : 'Approve'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleReject(item._id)}
                              className="px-3 py-1 bg-rose-600/20 text-rose-300 rounded-lg hover:bg-rose-600/30 transition-colors text-sm"
                            >
                              Reject
                            </motion.button>
                          </>
                        )}
                        {item.userData.status !== 'verificationPending' && (
                          <span className="text-sm text-gray-400">
                            Reviewed
                          </span>
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
        {documentViewerOpen && selectedDocument && (
          <DocumentViewerModal
            isOpen={documentViewerOpen}
            onClose={() => setDocumentViewerOpen(false)}
            title={selectedDocument.title}
            documentUrl={selectedDocument.url}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {postLinksModalOpen && (
          <PostLinksModal
            isOpen={postLinksModalOpen}
            onClose={() => setPostLinksModalOpen(false)}
            postLinks={selectedPostLinks}
            userName={selectedUserName}
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
