import React from 'react';
import { motion } from 'framer-motion';
import { Gift, CheckCircle, Lock } from 'lucide-react';
import { api } from '../../../lib/api';
import { useTaskAuthStore } from '../../../store/useTaskAuthStore';
import { getTaskAssetUrl } from '../../../lib/cdn';
import { DashboardGlassCard } from '../components/ui/DashboardGlassCard';

interface ApiError {
  response?: { data?: { message?: string } };
}

interface RewardsViewProps {
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  addNotification,
}) => {
  const { taskUserID } = useTaskAuthStore();

  const { data, isLoading, refetch } = api.srkTask.getSrkTaskUserRewards.useQuery(
    ['getSrkTaskUserRewards', taskUserID],
    { params: { userId: taskUserID || '' } },
    { queryKey: ['getSrkTaskUserRewards', taskUserID], enabled: !!taskUserID }
  );

  const claimMutation = api.srkTask.claimSrkTaskReward.useMutation({
    onSuccess: (res) => {
      addNotification(
        res.body.message || 'Reward claimed successfully',
        'success'
      );
      refetch();
    },
    onError: (error: unknown) => {
      addNotification(
        (error as ApiError)?.response?.data?.message || 'Failed to claim reward',
        'error'
      );
    },
  });

  const rewards = data?.body.data ?? [];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B68938] mx-auto"></div>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No rewards available right now</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rewards.map((reward) => {
        const percent = Math.min(
          100,
          Math.floor((reward.currentCoins / reward.requiredCoins) * 100)
        );
        const isClaiming =
          claimMutation.isPending &&
          claimMutation.variables?.params.rewardId === reward._id;

        return (
          <motion.div
            key={reward._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DashboardGlassCard className="p-0 overflow-hidden h-full flex flex-col">
              <img
                src={getTaskAssetUrl(reward.photoUrl)}
                alt={reward.title}
                loading="lazy"
                className={`w-full h-44 object-cover ${
                  reward.isEligible ? '' : 'grayscale opacity-60'
                }`}
              />
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="text-lg font-bold">{reward.title}</h3>
                <p className="text-sm text-gray-400 flex-1">{reward.description}</p>

                {reward.isEligible ? (
                  <>
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>
                          {Math.min(
                            reward.currentCoins,
                            reward.requiredCoins
                          ).toLocaleString()}{' '}
                          / {reward.requiredCoins.toLocaleString()} TTL
                        </span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#B68938] to-[#E1BA73] transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {reward.isClaimed ? (
                      <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-500/20 text-green-400 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Claimed
                      </div>
                    ) : (
                      <button
                        disabled={!reward.isCompleted || isClaiming}
                        onClick={() =>
                          claimMutation.mutate({
                            params: {
                              userId: taskUserID || '',
                              rewardId: reward._id,
                            },
                            body: {},
                          })
                        }
                        className="py-3 rounded-lg font-medium bg-[#B68938] text-black hover:bg-[#E1BA73] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isClaiming ? 'Claiming...' : 'Claim'}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-800/60 text-sm text-gray-400">
                    <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                    This reward is not available for your account. It is only
                    available to users who registered after it was created.
                  </div>
                )}
              </div>
            </DashboardGlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};
