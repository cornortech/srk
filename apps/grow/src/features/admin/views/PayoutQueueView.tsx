import { useCallback, useState } from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';
import { THEME } from '../constants/theme';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/contexts/ToastContext';
import { PayoutApprovalModal } from '../Modals/PayoutApprovalModal';
import { RejectionModal } from '../Modals/RejectionModal';
import TablePagination from '../../../lib/ui/TablePagination';

export const PayoutQueueView: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | undefined>('pending');
  const [selected, setSelected] = useState<string[]>([]);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);
  const [selectedPayoutAmount, setSelectedPayoutAmount] = useState<number>(0);

  const { showToast } = useToast();

  // Fetch payouts
  const { data: payoutsData, isLoading, refetch } = api.grow.getSrkGrowAffiliateEarningPayoutRequestByAdmin.useQuery(
    ['grow-affiliate-payouts', page, statusFilter],
    {
      query: {
        page: page.toString(),
        limit: '10',
        status: statusFilter,
      },
    }
  );

  // Approve mutation
  const { mutate: approveMutation, isPending: isApproving } =
    api.grow.acceptGrowSrkAffiliateEarningPayoutRequestByAdmin.useMutation({
      onSuccess: () => {
        showToast('Payout approved successfully', 'success');
        refetch();
        setApprovalModalOpen(false);
        setSelectedPayoutId(null);
      },
      onError: (error: any) => {
        showToast(error?.body?.message || 'Failed to approve payout', 'error');
      },
    });

  // Reject mutation
  const { mutate: rejectMutation, isPending: isRejecting } =
    api.grow.rejectGrowSrkAffiliateEarningPayoutRequestByAdmin.useMutation({
      onSuccess: () => {
        showToast('Payout rejected successfully', 'success');
        refetch();
        setRejectionModalOpen(false);
        setSelectedPayoutId(null);
      },
      onError: (error: any) => {
        showToast(error?.body?.message || 'Failed to reject payout', 'error');
      },
    });

  const handleApprove = useCallback((id: string, amount: number) => {
    setSelectedPayoutId(id);
    setSelectedPayoutAmount(amount);
    setApprovalModalOpen(true);
  }, []);

  const handleReject = useCallback((id: string) => {
    setSelectedPayoutId(id);
    setRejectionModalOpen(true);
  }, []);

  const handleApprovalSubmit = useCallback((transactionId: string, paymentUrl?: string) => {
    if (selectedPayoutId) {
      approveMutation({
        params: { id: selectedPayoutId },
        body: { transactionId, paymentUrl },
      });
    }
  }, [selectedPayoutId, approveMutation]);

  const handleRejectionSubmit = useCallback((rejectionReason: string) => {
    if (selectedPayoutId) {
      rejectMutation({
        params: { id: selectedPayoutId },
        body: { rejectionReason },
      });
    }
  }, [selectedPayoutId, rejectMutation]);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked && payoutsData?.body?.data) {
        setSelected(payoutsData.body.data.map((p) => p._id));
      } else {
        setSelected([]);
      }
    },
    [payoutsData?.body?.data]
  );

  const handleSelect = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected((prev) => prev.filter((itemId) => itemId !== id));
    }
  }, []);

  const handleBulkProcess = useCallback(() => {
    if (selected.length > 0) {
      showToast(`Bulk processing is not yet implemented for ${selected.length} payouts`, 'info');
    }
    setSelected([]);
  }, [selected.length, showToast]);

  const payouts = payoutsData?.body?.data || [];
  // const pagination = payoutsData?.body?.pagination;
  const totalPages = payoutsData?.body?.totalPages || 1;
  const currentPage = page;
  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            <GradientText>Payout Queue</GradientText>
          </h1>
          <p className="text-gray-400 mt-2">
            Process affiliate payout requests
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter || 'all'}
            onChange={(e) => {
              const value = e.target.value;
              setStatusFilter(value === 'all' ? undefined : value as any);
              setPage(1);
            }}
            className="bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#b68938]/50"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Status</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Total:{' '}
              <span className="text-white font-bold">
                ₹{totalAmount.toFixed(2)}
              </span>
            </span>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#b68938]"></div>
              <p className="text-gray-400 mt-4">Loading payouts...</p>
            </div>
          ) : payouts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No payout requests found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        <input
                          type="checkbox"
                          className="rounded border-white/20 bg-black/30 checked:bg-[#b68938]"
                          onChange={handleSelectAll}
                          checked={selected.length > 0 && selected.length === payouts.length}
                        />
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        User
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Email
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Phone
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Amount (₹)
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Date
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout, index) => (
                      <motion.tr
                        key={payout._id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <input
                            type="checkbox"
                            checked={selected.includes(payout._id)}
                            onChange={(e) =>
                              handleSelect(payout._id, e.target.checked)
                            }
                            className="rounded border-white/20 bg-black/30 checked:bg-[#b68938]"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {payout.srkGrowUser?.fullName || 'N/A'}
                            </span>
                            <code className="text-xs font-mono text-gray-500">
                              {payout.srkGrowUser?._id}
                            </code>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-300 text-sm">
                            {payout.srkGrowUser?.email || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-300 text-sm">
                            {payout.srkGrowUser?.phoneNumber || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="text-2xl font-bold"
                            style={{ color: THEME.colors.goldAccent }}
                          >
                            ₹{payout.amount.toFixed(2)}
                          </motion.span>
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm">
                          {moment(payout.createdAt).format('MMM DD, YYYY')}
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={payout.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            {payout.status === 'pending' && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleApprove(payout._id, payout.amount)}
                                  className="px-4 py-2 bg-emerald-600/20 text-emerald-300 rounded-lg hover:bg-emerald-600/30 transition-colors text-sm"
                                >
                                  Approve
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleReject(payout._id)}
                                  className="px-4 py-2 bg-rose-600/20 text-rose-300 rounded-lg hover:bg-rose-600/30 transition-colors text-sm"
                                >
                                  Reject
                                </motion.button>
                              </>
                            )}
                            {payout.status === 'approved' && payout.transactionId && (
                              <div className="text-sm">
                                <p className="text-emerald-400">Paid</p>
                                <p className="text-xs text-gray-500">TXN: {payout.transactionId}</p>
                              </div>
                            )}
                            {payout.status === 'rejected' && payout.rejectionReason && (
                              <div className="text-sm">
                                <p className="text-rose-400">Rejected</p>
                                <p className="text-xs text-gray-500">{payout.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              { totalPages > 1 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <TablePagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}

          {selected.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center"
            >
              <span className="text-gray-400">{selected.length} selected</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBulkProcess}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Bulk Process Selected
              </motion.button>
            </motion.div>
          )}
        </div>
      </GlassCard>

      {/* Approval Modal */}
      <PayoutApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setSelectedPayoutId(null);
        }}
        onSubmit={handleApprovalSubmit}
        isApproving={isApproving}
        payoutAmount={selectedPayoutAmount}
      />

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejectionModalOpen}
        onClose={() => {
          setRejectionModalOpen(false);
          setSelectedPayoutId(null);
        }}
        onSubmit={handleRejectionSubmit}
        isRejecting={isRejecting}
        title="Reject Payout Request"
      />
    </motion.div>
  );
};
