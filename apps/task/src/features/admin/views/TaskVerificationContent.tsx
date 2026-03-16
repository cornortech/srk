import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, DollarSign, CheckCircle, X, ChevronLeft, ChevronRight, CheckSquare, Square, Trash2 } from 'lucide-react';
import { RejectionModal } from '../components/modals/RejectionModal';
import { BulkApprovalModal } from '../components/modals/BulkApprovalModal';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';
import { api } from '../../../lib/api';

export const TaskVerificationContent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    submissionId: string | null;
    isBulk: boolean;
    taskName: string;
    username: string;
  }>({
    isOpen: false,
    submissionId: null,
    isBulk: false,
    taskName: '',
    username: '',
  });

  const [bulkApprovalModal, setBulkApprovalModal] = useState({
    isOpen: false,
  });

  // Fetch pending task submissions
  const queryResult =
    api.srkTask.getAllSrkTasksActionSubmissionByStatusForAdmin.useQuery(
      ['admin-task-submissions', page],
      {
        query: {
          page: page.toString(),
          limit: '10',
          status: 'pending',
        },
      }
    );

  const { data, isLoading, error, refetch } = queryResult;

  const submissions = useMemo(() => data?.body?.data || [], [data]);

  // Bulk Approve mutation
  const bulkApproveMutation = api.srkTask.bulkApproveSrkTaskSubmissionsByAdmin.useMutation({
    onSuccess: () => {
      setSelectedIds(new Set());
      setBulkApprovalModal({ isOpen: false });
      refetch();
    },
  });

  // Bulk Reject mutation
  const bulkRejectMutation = api.srkTask.bulkRejectSrkTaskSubmissionsByAdmin.useMutation({
    onSuccess: () => {
      setSelectedIds(new Set());
      setRejectionModal({
        isOpen: false,
        submissionId: null,
        isBulk: false,
        taskName: '',
        username: '',
      });
      refetch();
    },
  });

  // Approve mutation
  const approveMutation = api.srkTask.approveSrkTaskActionSubmissionByAdmin.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Reject mutation
  const rejectMutation = api.srkTask.rejectSrkTaskActionSubmissionByAdmin.useMutation({
    onSuccess: () => {
      refetch();
      setRejectionModal({
        isOpen: false,
        submissionId: null,
        isBulk: false,
        taskName: '',
        username: '',
      });
    },
  });

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(submissions.map((s) => s._id)));
    }
  }, [selectedIds, submissions]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBulkApprove = useCallback(() => {
    if (selectedIds.size === 0) return;
    setBulkApprovalModal({ isOpen: true });
  }, [selectedIds]);

  const handleConfirmBulkApprove = useCallback(() => {
    bulkApproveMutation.mutate({
      body: { submissionIds: Array.from(selectedIds) },
    });
  }, [selectedIds, bulkApproveMutation]);

  const handleBulkReject = useCallback(() => {
    if (selectedIds.size === 0) return;
    setRejectionModal({
      isOpen: true,
      submissionId: null,
      isBulk: true,
      taskName: `${selectedIds.size} tasks`,
      username: 'Multiple Users',
    });
  }, [selectedIds]);

  const handleVerify = useCallback(
    (submissionId: string, status: 'approved' | 'rejected', taskName: string, username: string) => {
      if (status === 'approved') {
        approveMutation.mutate({
          params: { submissionId },
          body: {},
        });
      } else {
        setRejectionModal({
          isOpen: true,
          submissionId,
          isBulk: false,
          taskName,
          username,
        });
      }
    },
    [approveMutation]
  );

  const handleConfirmRejection = useCallback(
    (reason: string) => {
      if (rejectionModal.isBulk) {
        bulkRejectMutation.mutate({
          body: {
            submissionIds: Array.from(selectedIds),
            rejectionReason: reason,
          },
        });
      } else if (rejectionModal.submissionId) {
        rejectMutation.mutate({
          params: { submissionId: rejectionModal.submissionId },
          body: { rejectionReason: reason },
        });
      }
    },
    [rejectionModal, bulkRejectMutation, rejectMutation, selectedIds]
  );

  const handleCloseRejectionModal = useCallback(() => {
    setRejectionModal({
      isOpen: false,
      submissionId: null,
      isBulk: false,
      taskName: '',
      username: '',
    });
  }, []);

  if (isLoading) {
    return (
      <div className="text-center p-10 text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1BA73] mx-auto"></div>
        <p className="mt-4">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-red-400">
        Error loading submissions. Please try again.
      </div>
    );
  }

  const totalPages = data?.body?.totalPages || 1;

  if (submissions.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        All task submissions have been verified.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 relative">
        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-0 z-20 flex flex-wrap items-center justify-between p-4 mb-4 rounded-xl border border-[#E1BA73]/50 bg-gray-900 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#E1BA73]">
                  {selectedIds.size} Selected
                </span>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs text-gray-400 hover:text-white underline"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex gap-4">
                <GoldButton
                  onClick={handleBulkApprove}
                  className="px-6 py-2 text-sm uppercase"
                  disabled={bulkApproveMutation.isPending}
                >
                  {bulkApproveMutation.isPending ? 'Processing...' : 'Bulk Approve'}
                </GoldButton>
                <motion.button
                  onClick={handleBulkReject}
                  disabled={bulkRejectMutation.isPending}
                  className="px-6 py-2 text-sm uppercase rounded-xl bg-red-800/50 text-red-400 font-bold hover:bg-red-800/70 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {bulkRejectMutation.isPending ? 'Processing...' : 'Bulk Reject'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center border-b border-[#E1BA73]/30 pb-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Clock size={24} className="text-[#E1BA73]" /> Pending Task Reviews (
              {data?.body?.totalRecords || 0})
            </h2>
          </div>
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-sm text-[#E1BA73] hover:text-white transition-colors"
          >
            {selectedIds.size === submissions.length ? (
              <CheckSquare size={18} />
            ) : (
              <Square size={18} />
            )}
            {selectedIds.size === submissions.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((submission) => {
            const taskUser = submission.taskUserId;
            const todo = submission.growPackageTodoId;
            const enrollment = todo?.enrollment;
            const isSelected = selectedIds.has(submission._id);

            return (
              <div
                key={submission._id}
                className={`p-5 rounded-xl border transition-all relative ${
                  isSelected ? 'border-[#E1BA73] shadow-[0_0_15px_rgba(225,186,115,0.2)]' : 'border-gray-700/50 shadow-xl'
                }`}
                style={{ background: CARD_BG }}
              >
                {/* Selection Overlay */}
                <div
                  className="absolute top-4 right-4 z-10 cursor-pointer"
                  onClick={() => toggleSelect(submission._id)}
                >
                  {isSelected ? (
                    <CheckSquare size={24} className="text-[#E1BA73]" />
                  ) : (
                    <Square size={24} className="text-gray-600 hover:text-gray-400" />
                  )}
                </div>

                {/* User Info */}
                <div className="mb-4 pb-3 border-b border-gray-700/50 pr-8">
                  <h4 className="text-xs text-gray-400 uppercase mb-1">Submitted by</h4>
                  <p className="text-sm font-bold text-[#E1BA73]">
                    {taskUser?.fullName || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-400">{taskUser?.email || 'N/A'}</p>
                  <p className="text-xs text-gray-400">{taskUser?.phoneNumber || 'N/A'}</p>
                </div>

                {/* Enrollment/Package Info */}
                {enrollment && (
                  <div className="mb-4 pb-3 border-b border-gray-700/50">
                    <h4 className="text-xs text-gray-400 uppercase mb-1">Enrollment Package</h4>
                    <p className="text-sm font-semibold text-white">
                      {enrollment.growSocialMediaPackageId?.name || 'Package'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {enrollment.growSocialMediaPackageTypeId?.name || ''} -{' '}
                      {enrollment.growSocialMediaPackageSubTypeId?.name || ''}
                    </p>
                    <p className="text-xs text-[#E1BA73] mt-1">
                      Platform: {enrollment.socialMediaPlatform}
                    </p>
                  </div>
                )}

                {/* Task Details */}
                {todo && (
                  <div className="mb-4 pb-3 border-b border-gray-700/50">
                    <h4 className="text-xs text-gray-400 uppercase mb-1">Task Details</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md uppercase font-bold">
                        {todo.type}
                      </span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-md">
                        {todo.platform}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mb-2">{submission.description}</p>
                    <a
                      href={todo.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      View Post URL
                    </a>
                  </div>
                )}

                {/* Verification Image */}
                <div className="mb-4">
                  <h4 className="text-xs text-gray-400 uppercase mb-2">Verification Screenshot</h4>
                  <a
                    href={submission.screenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={submission.screenshotUrl}
                      alt="Verification"
                      className="w-full h-48 object-cover rounded-lg border border-gray-700 hover:border-[#E1BA73] transition-colors"
                    />
                  </a>
                </div>

                {/* Status & Actions */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Status: <span className="text-yellow-400 font-semibold uppercase">{submission.status}</span></span>
                    <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <GoldButton
                      onClick={() => handleVerify(
                        submission._id,
                        'approved',
                        todo?.type || 'Task',
                        taskUser?.fullName || 'User'
                      )}
                      className="flex-1 px-4 py-2 text-sm uppercase"
                    >
                      <CheckCircle size={16} className="inline mr-2" /> Approve
                    </GoldButton>
                    <motion.button
                      onClick={() => handleVerify(
                        submission._id,
                        'rejected',
                        todo?.type || 'Task',
                        taskUser?.fullName || 'User'
                      )}
                      className="flex-1 px-4 py-2 text-sm uppercase rounded-xl bg-red-800/50 text-red-400 font-bold hover:bg-red-800/70 transition-colors flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X size={16} /> Reject
                    </motion.button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={handleCloseRejectionModal}
        onConfirm={handleConfirmRejection}
        taskName={rejectionModal.taskName}
        username={rejectionModal.username}
      />

      <BulkApprovalModal
        isOpen={bulkApprovalModal.isOpen}
        onClose={() => setBulkApprovalModal({ isOpen: false })}
        onConfirm={handleConfirmBulkApprove}
        count={selectedIds.size}
        isProcessing={bulkApproveMutation.isPending}
      />
    </>
  );
};
