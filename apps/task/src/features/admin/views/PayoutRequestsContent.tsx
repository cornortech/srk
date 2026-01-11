import React, { useState, useCallback } from 'react';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';
import { api } from '../../../lib/api';
import { Loader2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transactionId: string, paymentScreenshotUrl: string) => void;
  payoutAmount: number;
  username: string;
  paymentDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    branchName: string;
    qrCodeUrl: string;
  } | null;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  payoutAmount,
  username,
  paymentDetails,
}) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');

  const handleSubmit = () => {
    if (transactionId.trim() && paymentScreenshotUrl.trim()) {
      onConfirm(transactionId, paymentScreenshotUrl);
      setTransactionId('');
      setPaymentScreenshotUrl('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1a1a1a] rounded-2xl p-6 max-w-2xl w-full border border-[#E1BA73]/30 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Approve Payout</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Approving payout for: <span className="text-[#E1BA73] font-semibold">{username}</span>
              </p>
              <p className="text-gray-300">
                Amount: <span className="text-green-400 font-bold">₹{payoutAmount.toFixed(2)}</span>
              </p>
            </div>

            {/* Payment Details Section */}
            {paymentDetails ? (
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold text-[#E1BA73] mb-3">User Payment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Account Holder</p>
                    <p className="text-sm text-white font-medium">{paymentDetails.accountHolderName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Bank Name</p>
                    <p className="text-sm text-white font-medium">{paymentDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Account Number</p>
                    <p className="text-sm text-white font-medium">{paymentDetails.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Branch</p>
                    <p className="text-sm text-white font-medium">{paymentDetails.branchName}</p>
                  </div>
                </div>
                {paymentDetails.qrCodeUrl && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400 mb-2">Payment QR Code</p>
                    <div className="flex justify-center">
                      <img
                        src={paymentDetails.qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-48 h-48 rounded-lg border-2 border-[#E1BA73]/30 object-contain bg-white p-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/30">
                <p className="text-yellow-400 text-sm">⚠️ No payment details found for this user. Please ask them to add payment details first.</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transaction ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E1BA73] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Screenshot URL *
                </label>
                <input
                  type="url"
                  value={paymentScreenshotUrl}
                  onChange={(e) => setPaymentScreenshotUrl(e.target.value)}
                  placeholder="Enter payment screenshot URL"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E1BA73] transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!transactionId.trim() || !paymentScreenshotUrl.trim()}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                <Check size={16} className="inline mr-1" /> Confirm Approval
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  payoutAmount: number;
  username: string;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  payoutAmount,
  username,
}) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full border border-red-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Reject Payout</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Rejecting payout for: <span className="text-[#E1BA73] font-semibold">{username}</span>
              </p>
              <p className="text-gray-300">
                Amount: <span className="text-red-400 font-bold">₹{payoutAmount.toFixed(2)}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
              >
                <X size={16} className="inline mr-1" /> Confirm Rejection
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PayoutRequestsContent: React.FC = React.memo(() => {
  const [page, setPage] = useState(1);
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    payoutId: string | null;
    amount: number;
    username: string;
    paymentDetails: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      branchName: string;
      qrCodeUrl: string;
    } | null;
  }>({
    isOpen: false,
    payoutId: null,
    amount: 0,
    username: '',
    paymentDetails: null,
  });
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    payoutId: string | null;
    amount: number;
    username: string;
  }>({
    isOpen: false,
    payoutId: null,
    amount: 0,
    username: '',
  });

  const { data: payoutData, isLoading, error: queryError, refetch } =
    api.srkTask.getAllSrkTaskEarningPayoutsByAdmin.useQuery(
      ['getAllSrkTaskEarningPayoutsByAdmin', page],
      {
        query: {
          page: page.toString(),
          limit: '10',
          status: 'pending',
        },
      }
    );

  // Approve mutation
  const approveMutation = api.srkTask.acceptSrkTaskUserEarningsPayout.useMutation({
    onSuccess: () => {
      refetch();
      setApprovalModal({
        isOpen: false,
        payoutId: null,
        amount: 0,
        username: '',
        paymentDetails: null,
      });
    },
  });

  // Reject mutation
  const rejectMutation = api.srkTask.rejectSrkTaskUserEarningsPayout.useMutation({
    onSuccess: () => {
      refetch();
      setRejectionModal({
        isOpen: false,
        payoutId: null,
        amount: 0,
        username: '',
      });
    },
  });

  const handleApproveClick = useCallback((
    payoutId: string, 
    amount: number, 
    username: string,
    paymentDetails: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      branchName: string;
      qrCodeUrl: string;
    } | null
  ) => {
    setApprovalModal({
      isOpen: true,
      payoutId,
      amount,
      username,
      paymentDetails,
    });
  }, []);

  const handleRejectClick = useCallback((payoutId: string, amount: number, username: string) => {
    setRejectionModal({
      isOpen: true,
      payoutId,
      amount,
      username,
    });
  }, []);

  const handleConfirmApproval = useCallback(
    (transactionId: string, paymentScreenshotUrl: string) => {
      if (approvalModal.payoutId) {
        approveMutation.mutate({
          params: { payoutId: approvalModal.payoutId },
          body: {
            transactionId,
            paymentScreenshotUrl,
          },
        });
      }
    },
    [approvalModal.payoutId, approveMutation]
  );

  const handleConfirmRejection = useCallback(
    (reason: string) => {
      if (rejectionModal.payoutId) {
        rejectMutation.mutate({
          params: { payoutId: rejectionModal.payoutId },
          body: {
            rejectionReason: reason,
          },
        });
      }
    },
    [rejectionModal.payoutId, rejectMutation]
  );

  const handleCloseApprovalModal = useCallback(() => {
    setApprovalModal({
      isOpen: false,
      payoutId: null,
      amount: 0,
      username: '',
      paymentDetails: null,
    });
  }, []);

  const handleCloseRejectionModal = useCallback(() => {
    setRejectionModal({
      isOpen: false,
      payoutId: null,
      amount: 0,
      username: '',
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#E1BA73]" />
        <span className="ml-3 text-gray-400">Loading payout requests...</span>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="text-center p-10 text-red-500">
        An error occurred while fetching payout requests
      </div>
    );
  }

  if (!payoutData?.body?.data || payoutData.body.data.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        No pending payout requests requiring action.
      </div>
    );
  }

  const pendingRequests = payoutData.body.data;
  const totalPages = payoutData.body.totalPages;

  return (
    <div>
      <div className="space-y-4">
        {pendingRequests.map((payout) => (
          <div
            key={payout._id}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 rounded-xl border border-gray-700/50"
            style={{ background: CARD_BG }}
          >
            <div className="flex-1 min-w-0 mb-3 lg:mb-0 space-y-1">
              <p className="text-white font-semibold text-lg truncate">
                {payout.taskUserId.fullName}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {payout.taskUserId.email}
              </p>
              <p className="text-gray-400 text-xs">
                User ID: <span className="text-white">{payout.taskUserId._id}</span>
              </p>
              <p className="text-gray-400 text-sm">
                Requested on:{' '}
                <span className="text-white">
                  {new Date(payout.createdAt).toLocaleDateString()}
                </span>
              </p>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${payout.status === 'pending'
                  ? 'bg-yellow-600/20 text-yellow-400'
                  : payout.status === 'approved'
                    ? 'bg-green-600/20 text-green-400'
                    : 'bg-red-600/20 text-red-400'
                  }`}
              >
                {payout.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8 w-full lg:w-auto">
              <div className="text-left">
                <p
                  className="text-xl font-extrabold"
                  style={{ color: GOLD_PRIMARY }}
                >
                  ₹{payout.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {payout.coinsUsed.toLocaleString()} Coins
                </p>
                <p className="text-xs text-gray-400">
                  TDS: ₹{payout.tds.toFixed(2)}
                </p>
              </div>

              {payout.transactionId && (
                <div className="text-left">
                  <p className="text-sm font-medium text-white">
                    {payout.transactionId}
                  </p>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                </div>
              )}

              <div className="flex gap-2">
                <GoldButton
                  onClick={() => handleApproveClick(
                    payout._id, 
                    payout.amount, 
                    payout.taskUserId.fullName,
                    payout.paymentDetails
                  )}
                  className="h-10 text-sm px-5 w-full sm:w-auto"
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Check size={16} className="inline mr-1" />
                  )}
                  Approve
                </GoldButton>
                <motion.button
                  onClick={() => handleRejectClick(payout._id, payout.amount, payout.taskUserId.fullName)}
                  disabled={rejectMutation.isPending}
                  className="h-10 text-sm px-5 w-full sm:w-auto rounded-xl bg-red-800/50 text-red-400 font-bold hover:bg-red-800/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <X size={16} />
                  )}
                  Reject
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      )}

      <ApprovalModal
        isOpen={approvalModal.isOpen}
        onClose={handleCloseApprovalModal}
        onConfirm={handleConfirmApproval}
        payoutAmount={approvalModal.amount}
        username={approvalModal.username}
        paymentDetails={approvalModal.paymentDetails}
      />

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={handleCloseRejectionModal}
        onConfirm={handleConfirmRejection}
        payoutAmount={rejectionModal.amount}
        username={rejectionModal.username}
      />
    </div>
  );
});
