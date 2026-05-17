import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  History,
  ImageIcon,
  Loader2,
  X,
  Gift,
} from 'lucide-react';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';
import DashboardGradientText from '../components/ui/DashboardGradientText';
import { api } from '../../../lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';
import { getTaskAssetUrl } from '../../../lib/cdn';

export const TaskHistoryView: React.FC = () => {
  const { taskUserID } = useTaskAuthStore();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected' | 'claimed'
  >('all');
  const [claimingSubmissionId, setClaimingSubmissionId] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showCongratulationModal, setShowCongratulationModal] = useState(false);
  const [selectedSubmissionForClaim, setSelectedSubmissionForClaim] = useState<any>(null);
  const LIMIT = 8;

  const { data: submissionsRes, isLoading, refetch } =
    api.srkTask.getAllSrkTasksActionSubmissionsByUser.useQuery(
      ['srk-task-submissions', taskUserID, page, statusFilter],
      {
        params: { userId: taskUserID || '' },
        query: {
          page: page.toString(),
          limit: LIMIT.toString(),
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      }
    );

    const queryClient = useQueryClient();

  const claimCoinsMutation =
    api.srkTask.claimCoinsForTaskActionSubmission.useMutation({
      onSuccess: async () => {
        await refetch();
        // Invalidate user analytics/profile so navbar balance updates
        queryClient.invalidateQueries({ queryKey: ['getSrkTaskUserAnalytics', taskUserID || ''] });
        queryClient.invalidateQueries({ queryKey: ['getSrkTaskUserProfile', taskUserID || ''] });
        setClaimingSubmissionId(null);
        setShowConfirmationModal(false);
        setShowCongratulationModal(true);
      },
      onError: () => {
        setClaimingSubmissionId(null);
      },
    });

  const submissions =
    submissionsRes?.status === 200 ? submissionsRes.body.data : [];
  const hasNextPage = submissions.length === LIMIT;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'text-green-400 bg-green-500/10 border-green-500/20',
          icon: <CheckCircle2 size={14} />,
        };
      case 'claimed':
        return {
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          icon: <CheckCircle2 size={14} />,
        };
      case 'rejected':
        return {
          color: 'text-red-400 bg-red-500/10 border-red-500/20',
          icon: <AlertCircle size={14} />,
        };
      default:
        return {
          color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
          icon: <Clock size={14} />,
        };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <DashboardGradientText>Task History</DashboardGradientText>
          </h1>
          <p className="text-zinc-400">
            Review your submitted tasks and status
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
          {(['all', 'pending', 'approved', 'claimed', 'rejected'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-amber-500 text-black shadow-lg'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {status === 'claimed'
                  ? 'Claim'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <DashboardGlassCard>
        <div className="p-6">
          {isLoading && submissions.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-amber-400" size={32} />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <History size={24} className="text-zinc-500" />
              </div>
              <p className="text-zinc-400 font-medium">No tasks found</p>
              <p className="text-sm text-zinc-600 mt-1">
                Tasks you submit will be listed here for tracking
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {submissions.map((item, idx) => {
                const statusConfig = getStatusConfig(item.status);
                const canClaim =
                  item.status === 'approved' && item.hasClaimedEarning === false;
                const isClaiming = claimingSubmissionId === item._id;
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Left: Image */}
                      <div className="flex-shrink-0">
                        <div className="w-full md:w-32 h-32 md:h-24 rounded-xl overflow-hidden bg-black/40 border border-white/10 group relative">
                          {item.screenshotUrl ? (
                            <a
                              href={getTaskAssetUrl(item.screenshotUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full h-full"
                            >
                              <img
                                src={getTaskAssetUrl(item.screenshotUrl)}
                                alt="Proof"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                                <ExternalLink
                                  size={16}
                                  className="text-white drop-shadow-lg"
                                />
                              </div>
                            </a>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={20} className="text-zinc-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-white text-lg">
                              {item.description || 'Task Submission'}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {item.growPackageTodoId?.enrollment && (
                                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-zinc-300">
                                  {item.growPackageTodoId.enrollment.socialMediaPlatform}
                                </span>
                              )}
                              <span className="text-xs text-zinc-500">
                                {format(
                                  new Date(item.createdAt),
                                  'MMM dd, HH:mm'
                                )}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border self-start ${statusConfig.color}`}
                          >
                            {statusConfig.icon}
                            <span className="capitalize text-sm font-bold">
                              {item.status}
                            </span>
                          </div>
                        </div>

                        {/* Rejection Reason Box */}
                        {item.status === 'rejected' && item.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-400">
                              <span className="font-bold">Reason:</span>{' '}
                              {item.rejectionReason}
                            </p>
                          </div>
                        )}

                        {canClaim && (
                          <div className="mt-4 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSubmissionForClaim(item);
                                setShowConfirmationModal(true);
                              }}
                              disabled={isClaiming}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                              {isClaiming ? 'Claiming...' : 'Claim Coins'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <p className="text-sm text-zinc-500">Page {page}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNextPage || isLoading}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </DashboardGlassCard>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmationModal && selectedSubmissionForClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Gift className="text-amber-400" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Claim Coins</h2>
                </div>
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-zinc-400 mb-1">You will receive</p>
                  <p className="text-3xl font-bold text-amber-400">
                    {selectedSubmissionForClaim.growPackageTodoId?.enrollment?.amount || '100'} Coins
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-zinc-400 mb-2">Task Details</p>
                  <div className="space-y-2">
                    <p className="text-white font-medium text-sm">
                      {selectedSubmissionForClaim.description || 'Task Submission'}
                    </p>
                    {selectedSubmissionForClaim.growPackageTodoId?.enrollment?.socialMediaPlatform && (
                      <p className="text-xs text-zinc-400">
                        Platform:{' '}
                        <span className="text-amber-400">
                          {selectedSubmissionForClaim.growPackageTodoId.enrollment.socialMediaPlatform}
                        </span>
                      </p>
                    )}
                    <p className="text-xs text-zinc-500">
                      Submitted: {format(new Date(selectedSubmissionForClaim.createdAt), 'MMM dd, HH:mm')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setClaimingSubmissionId(selectedSubmissionForClaim._id);
                    claimCoinsMutation.mutate({
                      params: { submissionId: selectedSubmissionForClaim._id },
                      body: {},
                    });
                  }}
                  disabled={claimCoinsMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {claimCoinsMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    'Claim Now'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congratulation Modal */}
      <AnimatePresence>
        {showCongratulationModal && selectedSubmissionForClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="text-amber-400" size={40} />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-2">Congratulations! 🎉</h2>
              <p className="text-zinc-300 mb-6">
                You have successfully claimed{' '}
                <span className="text-amber-400 font-bold">
                  {selectedSubmissionForClaim.growPackageTodoId?.enrollment?.amount || '100'} Coins
                </span>
              </p>

              <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-6">
                <p className="text-sm text-zinc-400 mb-1">Updated Balance</p>
                <p className="text-2xl font-bold text-green-400">
                  +{selectedSubmissionForClaim.growPackageTodoId?.enrollment?.amount || '100'} Added
                </p>
              </div>

              <button
                onClick={() => {
                  setShowCongratulationModal(false);
                  setSelectedSubmissionForClaim(null);
                }}
                className="w-full px-4 py-2.5 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
