import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RejectionModal } from '../components/modals/RejectionModal';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';
import { api } from '../../../lib/api';

export const TaskVerificationContent: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    submissionId: string | null;
    taskName: string;
    username: string;
  }>({
    isOpen: false,
    submissionId: null,
    taskName: '',
    username: '',
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
        taskName: '',
        username: '',
      });
    },
  });

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
          taskName,
          username,
        });
      }
    },
    [approveMutation]
  );

  const handleConfirmRejection = useCallback(
    (reason: string) => {
      if (rejectionModal.submissionId) {
        rejectMutation.mutate({
          params: { submissionId: rejectionModal.submissionId },
          body: { rejectionReason: reason },
        });
      }
    },
    [rejectionModal.submissionId, rejectMutation]
  );

  const handleCloseRejectionModal = useCallback(() => {
    setRejectionModal({
      isOpen: false,
      submissionId: null,
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

  const submissions = data?.body?.data || [];
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
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#E1BA73]/30 pb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Clock size={24} className="text-[#E1BA73]" /> Pending Task Reviews (
            {data?.body?.totalRecords || 0})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((submission) => {
            const taskUser = submission.taskUserId;
            const todo = submission.growPackageTodoId;
            const enrollment = todo?.enrollment;

            return (
              <div
                key={submission._id}
                className="p-5 rounded-xl border border-gray-700/50 shadow-xl"
                style={{ background: CARD_BG }}
              >
                {/* User Info */}
                <div className="mb-4 pb-3 border-b border-gray-700/50">
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
    </>
  );
};
