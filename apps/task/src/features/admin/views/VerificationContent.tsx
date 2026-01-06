import React, { useCallback, useState } from 'react';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG } from '../constants/theme';
import { api } from '../../../lib/api';
import { Loader2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  username: string;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
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
              <h3 className="text-xl font-bold text-white">
                Reject Verification
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Rejecting verification for:{' '}
                <span className="text-[#E1BA73] font-semibold">{username}</span>
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

export const VerificationContent: React.FC = React.memo(() => {
  const [page, setPage] = useState(1);
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    username: string;
  }>({
    isOpen: false,
    userId: null,
    username: '',
  });

  const {
    data: verificationData,
    isLoading,
    error: queryError,
    refetch,
  } = api.srkTask.getSrkTaskOnboardingVerificationRequestForAdmin.useQuery(
    ['getSrkTaskOnboardingVerificationRequestForAdmin', page],
    {
      query: {
        page: page.toString(),
        limit: '10',
        status: 'pending',
      },
    }
  );

  // Approve mutation
  const approveMutation =
    api.srkTask.approveSrkTaskOnboardingVerificationByAdmin.useMutation({
      onSuccess: () => {
        refetch();
      },
    });

  // Reject mutation
  const rejectMutation =
    api.srkTask.rejectSrkTaskOnboardingVerificationByAdmin.useMutation({
      onSuccess: () => {
        refetch();
        setRejectionModal({
          isOpen: false,
          userId: null,
          username: '',
        });
      },
    });

  const handleApprove = useCallback(
    (userId: string) => {
      approveMutation.mutate({
        params: { srkTaskUserId: userId },
      });
    },
    [approveMutation]
  );

  const handleReject = useCallback((userId: string, username: string) => {
    setRejectionModal({
      isOpen: true,
      userId,
      username,
    });
  }, []);

  const handleConfirmRejection = useCallback(
    (reason: string) => {
      if (rejectionModal.userId) {
        rejectMutation.mutate({
          params: { srkTaskUserId: rejectionModal.userId },
          body: { rejectionReason: reason },
        });
      }
    },
    [rejectionModal.userId, rejectMutation]
  );

  const handleCloseRejectionModal = useCallback(() => {
    setRejectionModal({
      isOpen: false,
      userId: null,
      username: '',
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#E1BA73]" />
        <span className="ml-3 text-gray-400">
          Loading verification requests...
        </span>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="text-center p-10 text-red-500">
        An error occurred while fetching data
      </div>
    );
  }

  if (
    !verificationData?.body?.data ||
    verificationData.body.data.length === 0
  ) {
    return (
      <div className="text-center p-10 text-gray-500">
        No pending verification requests.
      </div>
    );
  }

  const data = verificationData.body.data;
  const totalPages = verificationData.body.totalPages;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((request) => (
          <div
            key={request._id}
            className="p-4 sm:p-6 rounded-xl border border-gray-700/50"
            style={{ background: CARD_BG }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-4">
              <img
                src={request.imageUrl}
                alt={request.taskUserId.fullName}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#E1BA73] flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/150';
                }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">
                  {request.taskUserId.fullName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {request.taskUserId.srkUniversityUserId.email}
                </p>
                <p className="text-xs text-gray-500">
                  {request.taskUserId.srkUniversityUserId.phoneNumber}
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-400 mb-4 space-y-2">
              <p>
                <span className="text-gray-500">DOB:</span>{' '}
                <span className="text-white">{request.taskUserId.dob}</span>
              </p>
              <p>
                <span className="text-gray-500">Requested:</span>{' '}
                <span className="text-white">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </p>
              <p>
                <span className="text-gray-500">Status:</span>{' '}
                <span
                  className={`font-semibold ${
                    request.status === 'pending'
                      ? 'text-yellow-400'
                      : request.status === 'approved'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {request.status.toUpperCase()}
                </span>
              </p>

              <div className="pt-2 space-y-1">
                <a
                  href={request.kycDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-400 cursor-pointer hover:underline"
                >
                  📄 View KYC Document
                </a>
                <a
                  href={request.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 cursor-pointer hover:underline"
                >
                  🖼️ View Photo
                </a>
                <a
                  href={request.signatureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-purple-400 cursor-pointer hover:underline"
                >
                  ✍️ View Signature
                </a>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <GoldButton
                onClick={() => handleApprove(request.taskUserId._id)}
                className="flex-1"
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Check size={16} className="inline mr-1" />
                )}
                Approve
              </GoldButton>
              <button
                onClick={() =>
                  handleReject(
                    request.taskUserId._id,
                    request.taskUserId.fullName
                  )
                }
                disabled={rejectMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <X size={16} />
                )}
                Reject
              </button>
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

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={handleCloseRejectionModal}
        onConfirm={handleConfirmRejection}
        username={rejectionModal.username}
      />
    </div>
  );
});
