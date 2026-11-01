import { srkTaskContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import mongoose from 'mongoose';
import { srkTaskRewardModel } from '../../../model/task/srkTaskRewardModel';
import { srkTaskRewardClaimModel } from '../../../model/task/srkTaskRewardClaimModel';
import { srkTaskUserModel } from '../../../model/task/srkTaskUserModel';
import { srkTaskEarningStatementModel } from '../../../model/task/srkTaskEarningStatementModel';

const serverError = (error: unknown, message: string) => {
  console.error(message, error);
  return {
    status: 500 as const,
    body: {
      success: false,
      message: error instanceof Error ? error.message : message,
    },
  };
};

// Lifetime coins credited to the user, same source as the analytics view
const getLifetimeCoins = async (taskUserId: mongoose.Types.ObjectId) => {
  const agg = await srkTaskEarningStatementModel.aggregate([
    { $match: { taskUserId, type: 'credit' } },
    { $group: { _id: null, total: { $sum: '$coin' } } },
  ]);
  return (agg[0]?.total as number | undefined) ?? 0;
};

const createSrkTaskReward: AppRouteImplementationOrOptions<
  typeof srkTaskContract.createSrkTaskReward
> = async ({ body }) => {
  try {
    await srkTaskRewardModel.create(body);
    return {
      status: 201,
      body: { success: true, message: 'Reward created successfully' },
    };
  } catch (error) {
    return serverError(error, 'Failed to create reward');
  }
};

const getAllSrkTaskRewardsForAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getAllSrkTaskRewardsForAdmin
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);

    const [totalRecords, rewards] = await Promise.all([
      srkTaskRewardModel.countDocuments(),
      srkTaskRewardModel
        .find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const claimCounts = await srkTaskRewardClaimModel.aggregate([
      { $match: { rewardId: { $in: rewards.map((r) => r._id) } } },
      { $group: { _id: '$rewardId', count: { $sum: 1 } } },
    ]);
    const countById = new Map<string, number>(
      claimCounts.map((c) => [c._id.toString(), c.count])
    );

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data: rewards.map((r) => ({
          _id: r._id.toString(),
          title: r.title,
          description: r.description,
          photoUrl: r.photoUrl,
          requiredCoins: r.requiredCoins,
          isActive: r.isActive,
          claimCount: countById.get(r._id.toString()) ?? 0,
          createdAt: r.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch rewards');
  }
};

const toggleSrkTaskRewardActive: AppRouteImplementationOrOptions<
  typeof srkTaskContract.toggleSrkTaskRewardActive
> = async ({ params }) => {
  try {
    const reward = await srkTaskRewardModel.findById(params.rewardId);
    if (!reward) {
      return {
        status: 404,
        body: { success: false, message: 'Reward not found' },
      };
    }
    reward.isActive = !reward.isActive;
    await reward.save();
    return {
      status: 200,
      body: {
        success: true,
        message: reward.isActive ? 'Reward enabled' : 'Reward disabled',
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to update reward');
  }
};

const getSrkTaskRewardClaimsForAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getSrkTaskRewardClaimsForAdmin
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const filter = query?.rewardId ? { rewardId: query.rewardId } : {};

    const [totalRecords, claims] = await Promise.all([
      srkTaskRewardClaimModel.countDocuments(filter),
      srkTaskRewardClaimModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('rewardId', 'title requiredCoins')
        .populate({
          path: 'taskUserId',
          populate: {
            path: 'srkUniversityUserId',
            select: 'fullName email phoneNumber',
          },
        })
        .lean(),
    ]);

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data: claims.map((c: any) => ({
          _id: c._id.toString(),
          rewardTitle: c.rewardId?.title ?? 'Deleted reward',
          requiredCoins: c.rewardId?.requiredCoins ?? 0,
          coinsAtClaim: c.coinsAtClaim,
          user: {
            _id: c.taskUserId?._id?.toString() ?? '',
            fullName:
              c.taskUserId?.srkUniversityUserId?.fullName ||
              c.taskUserId?.fullName ||
              'N/A',
            email: c.taskUserId?.srkUniversityUserId?.email || 'N/A',
            phoneNumber: c.taskUserId?.srkUniversityUserId?.phoneNumber || 'N/A',
          },
          claimedAt: c.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch reward claims');
  }
};

const getSrkTaskUserRewards: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getSrkTaskUserRewards
> = async ({ params }) => {
  try {
    const taskUser = await srkTaskUserModel.findById(params.userId).lean();
    if (!taskUser) {
      return {
        status: 404,
        body: { success: false, message: 'Task user not found' },
      };
    }

    const [rewards, claims, currentCoins] = await Promise.all([
      srkTaskRewardModel.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
      srkTaskRewardClaimModel.find({ taskUserId: taskUser._id }).lean(),
      getLifetimeCoins(taskUser._id),
    ]);
    const claimByReward = new Map(
      claims.map((c) => [c.rewardId.toString(), c])
    );

    return {
      status: 200,
      body: {
        success: true,
        data: rewards.map((r) => {
          const claim = claimByReward.get(r._id.toString());
          // Only users who registered after the reward was created qualify
          const isEligible = taskUser.createdAt > r.createdAt;
          return {
            _id: r._id.toString(),
            title: r.title,
            description: r.description,
            photoUrl: r.photoUrl,
            requiredCoins: r.requiredCoins,
            createdAt: r.createdAt.toISOString(),
            isEligible,
            currentCoins,
            isCompleted: isEligible && currentCoins >= r.requiredCoins,
            isClaimed: !!claim,
            claimedAt: claim?.createdAt.toISOString(),
          };
        }),
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch rewards');
  }
};

const claimSrkTaskReward: AppRouteImplementationOrOptions<
  typeof srkTaskContract.claimSrkTaskReward
> = async ({ params }) => {
  try {
    const [taskUser, reward] = await Promise.all([
      srkTaskUserModel.findById(params.userId).lean(),
      srkTaskRewardModel.findById(params.rewardId).lean(),
    ]);

    if (!taskUser || !reward || !reward.isActive) {
      return {
        status: 404,
        body: { success: false, message: 'Reward not found' },
      };
    }
    if (taskUser.createdAt <= reward.createdAt) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'This reward is not available for your account',
        },
      };
    }

    const coins = await getLifetimeCoins(taskUser._id);
    if (coins < reward.requiredCoins) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'You have not completed the earning for this reward yet',
        },
      };
    }

    try {
      await srkTaskRewardClaimModel.create({
        rewardId: reward._id,
        taskUserId: taskUser._id,
        coinsAtClaim: coins,
      });
    } catch (error) {
      // Unique index (rewardId + taskUserId): already claimed
      if ((error as { code?: number }).code === 11000) {
        return {
          status: 400,
          body: { success: false, message: 'Reward already claimed' },
        };
      }
      throw error;
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Reward claimed. Our team will contact you soon.',
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to claim reward');
  }
};

export const srkTaskRewardHandler = {
  createSrkTaskReward,
  getAllSrkTaskRewardsForAdmin,
  toggleSrkTaskRewardActive,
  getSrkTaskRewardClaimsForAdmin,
  getSrkTaskUserRewards,
  claimSrkTaskReward,
};
