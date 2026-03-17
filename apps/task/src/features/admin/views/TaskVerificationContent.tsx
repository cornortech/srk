import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  DollarSign,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Trash2,
  Eye,
  ArrowLeft,
  Mail,
  Phone,
  User,
  Shield,
  CreditCard,
} from 'lucide-react';
import { RejectionModal } from '../components/modals/RejectionModal';
import { BulkApprovalModal } from '../components/modals/BulkApprovalModal';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG, GOLD_PRIMARY, DARK_BG, TEXT_LIGHT } from '../constants/theme';
import { api } from '../../../lib/api';
import { Error } from 'mongoose';

export const TaskVerificationContent: React.FC = () => {
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingUserName, setViewingUserName] = useState<string>('');
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

  // Fetch users with pending submissions
  const usersQueryResult = api.srkTask.getAllSrkTasksActionSubmissionByStatusForAdmin.useQuery(
    ['admin-pending-submission-users', page],
    {
      query: {
        page: page.toString(),
        limit: '10',
        status: 'pending',
      },
    },
    {
      enabled: !viewingUserId,
      queryKey: ['admin-pending-submission-users', page],
    }
  );

  // Fetch pending task submissions for specific user
  const submissionsQueryResult = api.srkTask.getAllPendingTaskSubmissionsByUserForAdmin.useQuery(
    ['admin-user-task-submissions', viewingUserId, page],
    {
      query: {
        taskUserId: viewingUserId || '',
        page: page.toString(),
        limit: '10',
      },
    },
    {
      enabled: !!viewingUserId,
      queryKey: ['admin-user-task-submissions', viewingUserId, page],
    }
  );

  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = usersQueryResult;
  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    error: submissionsError,
    refetch: refetchSubmissions,
  } = submissionsQueryResult;

  const pendingUsers = useMemo(() => {
    if (!usersData?.body?.data) return [];
    const userMap = new Map();
    const PACKAGE_LIMITS: Record<string, number> = {
      'SRK Basic': 5,
      'SRK Lite': 4,
      'SRK Standard': 10,
      'SRK Premium': 15,
      'SRK PRO': 18,
    };

    usersData.body.data.forEach((sub: any) => {
      const uId = sub.taskUserId?._id;
      if (uId && !userMap.has(uId)) {
        const pkg = sub.taskUserId.packageName || 'SRK Basic';
        userMap.set(uId, {
          ...sub.taskUserId,
          pendingCount: 1,
          package: pkg,
          approvedCount: sub.taskUserId.approvedCount || 0,
          totalSubmissions: sub.taskUserId.totalSubmissions || 0,
          currentCoins: sub.taskUserId.currentCoins || 0,
          totalCoinsEarned: sub.taskUserId.totalCoinsEarned || 0,
          limit: PACKAGE_LIMITS[pkg] || 5,
        });
      } else if (uId) {
        const u = userMap.get(uId);
        u.pendingCount++;
      }
    });
    return Array.from(userMap.values());
  }, [usersData]);

  const submissions = useMemo(() => submissionsData?.body?.data || [], [submissionsData]);

  // Bulk Approve mutation
  const bulkApproveMutation = api.srkTask.bulkApproveSrkTaskSubmissionsByAdmin.useMutation({
    onSuccess: () => {
      setSelectedIds(new Set());
      setBulkApprovalModal({ isOpen: false });
      refetchSubmissions();
      // If no more submissions for this user, go back to user list
      if (submissions.length <= selectedIds.size) {
        setViewingUserId(null);
      }
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
      refetchSubmissions();
      if (submissions.length <= selectedIds.size) {
        setViewingUserId(null);
      }
    },
  });

  // Approve mutation
  const approveMutation = api.srkTask.approveSrkTaskActionSubmissionByAdmin.useMutation({
    onSuccess: () => {
      refetchSubmissions();
    },
  });

  // Reject mutation
  const rejectMutation = api.srkTask.rejectSrkTaskActionSubmissionByAdmin.useMutation({
    onSuccess: () => {
      refetchSubmissions();
      setRejectionModal({
        isOpen: false,
        submissionId: null,
        isBulk: false,
        taskName: '',
        username: '',
      });
    },
  });

  const handleEyeClick = (userId: string, userName: string) => {
    setViewingUserId(userId);
    setViewingUserName(userName);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleBackToUsers = () => {
    setViewingUserId(null);
    setViewingUserName('');
    setPage(1);
  };

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
    (
      submissionId: string,
      status: 'approved' | 'rejected',
      taskName: string,
      username: string
    ) => {
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

  const renderUserList = () => {
    if (isUsersLoading) {
      return (
        <div className="text-center p-10 text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1BA73] mx-auto"></div>
          <p className="mt-4">Loading pending submission users...</p>
        </div>
      );
    }

    if (usersError) {
      return (
        <div className="text-center p-10 text-red-400">
          Error loading pending users. Please try again.
        </div>
      );
    }

    if (pendingUsers.length === 0) {
      return (
        <div className="text-center p-10 text-gray-500">
          All task submissions have been verified.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#E1BA73]/30 pb-4 text-white">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <User size={24} className="text-[#E1BA73]" /> Pending Submission Users
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-700/50 shadow-lg bg-[#1A1715]">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#24201D] uppercase text-xs tracking-wider text-gray-400 border-b border-gray-700">
                <th className="py-4 px-6 text-left font-bold">User Details</th>
                <th className="py-4 px-6 text-left font-bold">Contact info</th>
                <th className="py-4 px-6 text-center font-bold">Coins</th>
                <th className="py-4 px-6 text-center font-bold">Package</th>
                <th className="py-4 px-6 text-center font-bold">Approved / Total</th>
                <th className="py-4 px-6 text-center font-bold">Pending</th>
                <th className="py-4 px-6 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {pendingUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-white text-base group-hover:text-[#E1BA73] transition-colors">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {user._id.slice(-8)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail size={14} className="text-[#E1BA73]/70" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone size={14} className="text-[#E1BA73]/70" />
                        <span>{user.phone || user.phoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[#E1BA73] font-bold text-sm">
                        {user.currentCoins.toLocaleString()} <span className="text-[10px] text-gray-500">CUR</span>
                      </span>
                      {/* <span className="text-emerald-400/70 text-[10px] font-medium">
                        {user.totalCoinsEarned.toLocaleString()} <span className="text-gray-600">TTL</span>
                      </span> */}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-full bg-[#E1BA73]/10 border border-[#E1BA73]/30 text-[#E1BA73] text-xs font-bold uppercase">
                      {user.package}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center gap-2">
                       <span className="text-emerald-400 font-bold">
                         {user.approvedCount}
                       </span>
                       <span className="text-gray-600">/</span>
                       <span className="text-gray-400 font-bold">{user.totalSubmissions}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-900/20 text-red-400 border border-red-800/30 font-bold text-sm">
                      {user.pendingCount}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEyeClick(user._id, user.fullName)}
                      className="p-2.5 rounded-lg bg-[#E1BA73] text-gray-900 hover:bg-[#F2CF93] transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 ml-auto font-bold text-xs"
                    >
                      <Eye size={18} /> VIEW TASKS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSubmissions = () => {
    if (isSubmissionsLoading) {
      return (
        <div className="text-center p-10 text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E1BA73] mx-auto"></div>
          <p className="mt-4">Loading user submissions...</p>
        </div>
      );
    }

    if (submissionsError) {
      return (
        <div className="text-center p-10 text-red-400">
          Error loading submissions. Please try again.
        </div>
      );
    }

    const totalSubRecords = submissionsData?.body?.totalRecords || 0;
    const totalSubPages = submissionsData?.body?.totalPages || 1;

    return (
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
                  {bulkApproveMutation.isPending
                    ? 'Processing...'
                    : 'Bulk Approve'}
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E1BA73]/30 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToUsers}
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                User: <span className="text-[#E1BA73]">{viewingUserName}</span>
              </h2>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">
                {totalSubRecords} Pending Submissions
              </p>
            </div>
          </div>
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-bold uppercase text-[#E1BA73] hover:text-white transition-all bg-[#E1BA73]/5 px-4 py-2 rounded-lg border border-[#E1BA73]/20 hover:border-[#E1BA73]/50"
          >
            {selectedIds.size === submissions.length ? (
              <CheckSquare size={16} />
            ) : (
              <Square size={16} />
            )}
            {selectedIds.size === submissions.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {submissions.map((submission: any) => {
            const todo = submission.growPackageTodoId;
            const enrollment = todo?.enrollment;
            const isSelected = selectedIds.has(submission._id);

            return (
              <div
                key={submission._id}
                className={`p-5 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'border-[#E1BA73] shadow-[0_0_20px_rgba(225,186,115,0.15)] ring-1 ring-[#E1BA73]/30'
                    : 'border-gray-700/50 shadow-xl'
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
                    <Square
                      size={24}
                      className="text-gray-600 hover:text-gray-400"
                    />
                  )}
                </div>

                {/* Enrollment/Package Info */}
                {enrollment && (
                  <div className="mb-4 pb-3 border-b border-gray-700/50">
                    <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                      Package Plan
                    </h4>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield size={14} className="text-[#E1BA73]" />
                      {enrollment.growSocialMediaPackageId?.name || 'Standard'}
                    </p>
                    <p className="text-[11px] text-[#E1BA73]/80 mt-1 font-semibold">
                      {enrollment.socialMediaPlatform} •{' '}
                      {enrollment.growSocialMediaPackageTypeId?.name}
                    </p>
                  </div>
                )}

                {/* Task Details */}
                {todo && (
                  <div className="mb-4 pb-3 border-b border-gray-700/50">
                    <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                      Task Requirements
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] rounded border border-blue-500/20 uppercase font-black">
                        {todo.type}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] rounded border border-purple-500/20 font-black">
                        {todo.platform}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mb-3 leading-relaxed line-clamp-2 italic">
                      "{submission.description}"
                    </p>
                    <a
                      href={todo.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors"
                    >
                      <CreditCard size={12} /> VIEW TARGET POST
                    </a>
                  </div>
                )}

                {/* Verification Image */}
                <div className="mb-4 group">
                  <h4 className="text-[10px] text-gray-500 uppercase font-bold mb-2">
                    Submission Evidence
                  </h4>
                  <div className="relative overflow-hidden rounded-lg border border-gray-700">
                    <img
                      src={submission.screenshotUrl}
                      alt="Verification"
                      className="w-full h-52 object-contain bg-black/50 transition-transform duration-500 group-hover:scale-105"
                    />
                    <a
                      href={submission.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold uppercase"
                    >
                      Open Full Size
                    </a>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-4 px-1">
                    <span className="font-bold">
                      SUBMITTED:{' '}
                      <span className="text-white">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-black border border-yellow-500/20 uppercase">
                      PENDING
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <GoldButton
                      onClick={() =>
                        handleVerify(
                          submission._id,
                          'approved',
                          todo?.type || 'Task',
                          viewingUserName
                        )
                      }
                      className="flex-1 py-2.5 text-xs font-black"
                    >
                      APPROVE
                    </GoldButton>
                    <motion.button
                      onClick={() =>
                        handleVerify(
                          submission._id,
                          'rejected',
                          todo?.type || 'Task',
                          viewingUserName
                        )
                      }
                      className="flex-1 py-2.5 text-xs font-black rounded-xl bg-red-900/30 text-red-500 border border-red-900/50 hover:bg-red-900/50 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      REJECT
                    </motion.button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalSubPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 pb-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-all flex items-center gap-2 border border-gray-700 text-sm font-bold"
            >
              <ChevronLeft size={18} /> PREV
            </button>
            <span className="text-sm font-bold text-gray-400 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
              PAGE {page} OF {totalSubPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalSubPages, p + 1))}
              disabled={page === totalSubPages}
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-all flex items-center gap-2 border border-gray-700 text-sm font-bold"
            >
              NEXT <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {viewingUserId ? renderSubmissions() : renderUserList()}
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
