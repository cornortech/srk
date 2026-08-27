import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { RejectionModal } from '../Modals/RejectionModal';
import { AffiliateDetailsModal } from '../Modals/AffiliateDetailsModal';
import { api } from '../../../lib/api';
import TablePagination from '../../../lib/ui/TablePagination';
import { Eye } from 'lucide-react';
import { useSRKAlert } from '@srk/shared/hooks';

export const AffiliateVerificationView = () => {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');

  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<NonNullable<typeof growAffiliateUser>['body']['data'][number] | null>(null);


  const limit = 10;

  const { show } = useSRKAlert();

  const {
    data: growAffiliateUser,
    isLoading,
    refetch,
  } = api.grow.getAllSrkGrowAffiliateVerificationRequest.useQuery(
    ['affiliatedUser', page],
    {
      query: {
        page: page.toString(),
        limit: limit.toString(),
        status: filterStatus === 'all' ? undefined : filterStatus,
      },
    }
  );

  const affiliateList = growAffiliateUser?.body.data ?? [];
  const totalPages = growAffiliateUser?.body.totalPages ?? 1;

  const pendingCount = affiliateList.filter(
    (i) => i.status === 'pending'
  ).length;
  const approvedCount = affiliateList.filter(
    (i) => i.status === 'approved'
  ).length;
  const rejectedCount = affiliateList.filter(
    (i) => i.status === 'rejected'
  ).length;

  const { mutate: approveAffiliate, isPending: isApproving } =
    api.grow.approveSrkGrowAffiliateVerificationRequest.useMutation({
      onSuccess: (res) => {
        if (res.status === 200) {
          show('Affiliate User approved', 'success');
        }
        refetch();
        setDetailsModalOpen(false);
      },
    });

  const { mutate: rejectAffiliate, isPending: isRejecting } =
    api.grow.rejectSrkGrowAffiliateVerificationRequest.useMutation({
      onSuccess: (res) => {
        if (res.status === 200) {
          show('Affiliate rejected', 'success');
        }
        refetch();
        setRejectionModalOpen(false);
        setDetailsModalOpen(false);
      },
    });

  const handleApprove = (id: string) => {
    approveAffiliate({
      params: { srkGrowaffiliateVerificationId: id },
    });
  };

  const handleReject = (id: string) => {
    setSelectedItemId(id);
    setRejectionModalOpen(true);
  };

  const handleRejectionSubmit = (reason: string) => {
    if (!selectedItemId) return;

    rejectAffiliate({
      params: { srkGrowaffiliateVerificationId: selectedItemId },
      body: { rejectionReason: reason },
    });
  };

  const handleViewDetails = (item: NonNullable<typeof growAffiliateUser>['body']['data'][number]) => {
    setSelectedAffiliate(item);
    setDetailsModalOpen(true);
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10';
      case 'rejected':
        return 'bg-rose-500/10';
      case 'pending':
        return 'bg-amber-500/10';
      default:
        return 'bg-zinc-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          <GradientText>Affiliate Verification</GradientText>
        </h1>
        <p className="text-gray-400 mt-2">
          Review and verify affiliate applications from SRK Portal
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="p-6">
            <p className="text-sm text-gray-400">Pending Review</p>
            <p className="text-3xl font-bold text-amber-400">{pendingCount}</p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <p className="text-sm text-gray-400">Approved</p>
            <p className="text-3xl font-bold text-emerald-400">
              {approvedCount}
            </p>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <p className="text-sm text-gray-400">Rejected</p>
            <p className="text-3xl font-bold text-rose-400">{rejectedCount}</p>
          </div>
        </GlassCard>
      </div>

      {/* Table */}
      <GlassCard>
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <p className="text-gray-400">
              {affiliateList.length} applications found
            </p>

            <select
              value={filterStatus}
              onChange={(e) => {
                setPage(1);
                setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected');
              }}
              className="bg-black/30 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="text-left p-3">S.N.</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Submitted Date</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliateList.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="p-3">
                      <code className="text-sm font-mono text-white group-hover:text-[#e1ba73] transition-colors">
                        {index + 1 + (page - 1) * limit}
                      </code>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-white">
                          {item.username}
                        </p>
                        <p className="text-sm text-gray-400">{item.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-white text-sm">{item.createdAt}</p>
                    </td>
                    <td className={`p-3 ${getStatusBackground(item.status)}`}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetails(item)}
                        className="p-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {!isLoading && affiliateList.length === 0 && (
              <p className="text-center text-gray-400 py-6">No records found</p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Pagination */}
      {totalPages > 1 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      <AnimatePresence>
        {detailsModalOpen && (
          <AffiliateDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            affiliateData={selectedAffiliate}
            onApprove={handleApprove}
            onReject={handleReject}
            isApproving={isApproving}
            selectedItemId={selectedItemId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectionModalOpen && (
          <RejectionModal
            isRejecting={isRejecting}
            isOpen={rejectionModalOpen}
            onClose={() => setRejectionModalOpen(false)}
            onSubmit={handleRejectionSubmit}
            title="Reject Affiliate Application"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
