import { rewardContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import mongoose from 'mongoose';
import { RewardModel } from '../../model/rewardModel';
import { RewardClaimModel } from '../../model/rewardClaimModel';
import { UserModel } from '../../model/userModel';
import { balanceModel } from '../../model/balanceModel';

const serverError = (error: unknown, message: string) => {
  console.error(message, error);
  return {
    status: 500 as const,
    body: { success: false, message: 'Internal server error' },
  };
};

// Same number the affiliate sees as "all time earnings" on the Earning page
const getAllTimeEarning = async (userId: string) => {
  const balance = await balanceModel.findOne({ userId }).lean();
  return balance?.totalEarnings ?? 0;
};

const createReward: AppRouteImplementationOrOptions<
  typeof rewardContract.createReward
> = async ({ body }) => {
  try {
    await RewardModel.create(body);
    return {
      status: 201,
      body: { success: true, message: 'Reward created successfully' },
    };
  } catch (error) {
    return serverError(error, 'Failed to create reward');
  }
};

const getAllRewards: AppRouteImplementationOrOptions<
  typeof rewardContract.getAllRewards
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);

    const [totalRecords, rewards] = await Promise.all([
      RewardModel.countDocuments(),
      RewardModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const claimCounts = await RewardClaimModel.aggregate([
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
          requiredEarning: r.requiredEarning,
          isActive: r.isActive,
          claimCount: countById.get(r._id.toString()) ?? 0,
          createdAt: (r as any).createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch rewards');
  }
};

const toggleRewardActive: AppRouteImplementationOrOptions<
  typeof rewardContract.toggleRewardActive
> = async ({ params }) => {
  try {
    const reward = await RewardModel.findById(params.rewardId);
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

const getRewardClaims: AppRouteImplementationOrOptions<
  typeof rewardContract.getRewardClaims
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);

    const [totalRecords, claims] = await Promise.all([
      RewardClaimModel.countDocuments(),
      RewardClaimModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('rewardId', 'title requiredEarning')
        .populate('userId', 'firstName lastName email phoneNumber')
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
          requiredEarning: c.rewardId?.requiredEarning ?? 0,
          earningAtClaim: c.earningAtClaim,
          user: {
            _id: c.userId?._id?.toString() ?? '',
            fullName: c.userId
              ? `${c.userId.firstName} ${c.userId.lastName}`
              : 'N/A',
            email: c.userId?.email ?? 'N/A',
            phoneNumber: c.userId?.phoneNumber ?? 'N/A',
          },
          claimedAt: c.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch reward claims');
  }
};

const getMyRewards: AppRouteImplementationOrOptions<
  typeof rewardContract.getMyRewards
> = async ({ req }) => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const user = userId ? await UserModel.findById(userId).lean() : null;
    if (!user) {
      return {
        status: 401,
        body: { success: false, message: 'Unauthorized' },
      };
    }

    const [rewards, claims, currentEarning] = await Promise.all([
      RewardModel.find({ isActive: true }).sort({ createdAt: -1 }).lean(),
      RewardClaimModel.find({ userId: user._id }).lean(),
      getAllTimeEarning(userId as string),
    ]);
    const claimByReward = new Map(
      claims.map((c) => [c.rewardId.toString(), c])
    );

    return {
      status: 200,
      body: rewards.map((r) => {
        const claim = claimByReward.get(r._id.toString());
        // Only users who registered after the reward was created qualify
        const isEligible = user.createdAt > (r as any).createdAt;
        return {
          _id: r._id.toString(),
          title: r.title,
          description: r.description,
          photoUrl: r.photoUrl,
          requiredEarning: r.requiredEarning,
          createdAt: (r as any).createdAt.toISOString(),
          isEligible,
          currentEarning,
          isCompleted: isEligible && currentEarning >= r.requiredEarning,
          isClaimed: !!claim,
          claimedAt: (claim as any)?.createdAt.toISOString(),
        };
      }),
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch rewards');
  }
};

const claimReward: AppRouteImplementationOrOptions<
  typeof rewardContract.claimReward
> = async ({ req, params }) => {
  try {
    const userId = (req as any).user?.userId as string | undefined;
    const [user, reward] = await Promise.all([
      userId ? UserModel.findById(userId).lean() : null,
      mongoose.isValidObjectId(params.rewardId)
        ? RewardModel.findById(params.rewardId).lean()
        : null,
    ]);

    if (!user || !reward || !reward.isActive) {
      return {
        status: 404,
        body: { success: false, message: 'Reward not found' },
      };
    }
    if (user.createdAt <= (reward as any).createdAt) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'This reward is not available for your account',
        },
      };
    }

    const earning = await getAllTimeEarning(userId as string);
    if (earning < reward.requiredEarning) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'You have not completed the earning for this reward yet',
        },
      };
    }

    try {
      await RewardClaimModel.create({
        rewardId: reward._id,
        userId: user._id,
        earningAtClaim: earning,
      });
    } catch (error) {
      // Unique index (rewardId + userId): already claimed
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

export const rewardHandler = {
  createReward,
  getAllRewards,
  toggleRewardActive,
  getRewardClaims,
  getMyRewards,
  claimReward,
};
