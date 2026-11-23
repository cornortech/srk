import { contentRewardContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import mongoose from 'mongoose';
import { ContentSubmissionModel } from '../../model/contentSubmissionModel';
import { ContentLeaderModel } from '../../model/contentLeaderModel';
import { UserModel } from '../../model/userModel';
import { cleanupR2Uploads } from '../../services/imageUploadService';
import { balanceModel } from '../../model/balanceModel';
import { EarningStatementModel } from '../../model/earningStatementModel';
import {
  getSubmissionWindow,
  nptDayKey,
  nptDayStart,
} from '../../utils/nepalTime';

const DAY_MS = 24 * 60 * 60 * 1000;

const serverError = (error: unknown, message: string) => {
  console.error(message, error);
  return {
    status: 500 as const,
    body: { success: false, message: 'Internal server error' },
  };
};

const fullName = (u?: { firstName?: string; lastName?: string } | null) =>
  u ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() : 'N/A';

const getUserId = (req: unknown) =>
  (req as { user?: { userId?: string } }).user?.userId;

// ---------------------------------------------------------------- user

const getContentSubmissionStatus: AppRouteImplementationOrOptions<
  typeof contentRewardContract.getContentSubmissionStatus
> = async ({ req }) => {
  try {
    const userId = getUserId(req);
    const user = userId
      ? await UserModel.findById(userId).select('canUploadContent').lean()
      : null;
    if (!user) {
      return {
        status: 401,
        body: { success: false, message: 'Unauthorized' },
      };
    }

    const now = new Date();
    const window = getSubmissionWindow(now);
    const hasSubmittedToday = !!(await ContentSubmissionModel.exists({
      userId: user._id,
      dayKey: nptDayKey(now),
    }));

    return {
      status: 200,
      body: {
        canUpload: !!user.canUploadContent,
        isWindowOpen: window.isOpen,
        hasSubmittedToday,
        nextOpensAt: window.nextOpensAt.toISOString(),
        windowLabel: window.label,
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to get content submission status');
  }
};

const submitContent: AppRouteImplementationOrOptions<
  typeof contentRewardContract.submitContent
> = async ({ req, body }) => {
  try {
    const userId = getUserId(req);
    const user = userId
      ? await UserModel.findById(userId).select('canUploadContent').lean()
      : null;
    if (!user || !user.canUploadContent) {
      return {
        status: 403,
        body: {
          success: false,
          message: 'You are not allowed to upload content',
        },
      };
    }

    const now = new Date();
    const window = getSubmissionWindow(now);
    if (!window.isOpen) {
      return {
        status: 400,
        body: {
          success: false,
          message: `Submissions are only open ${window.label}`,
        },
      };
    }

    try {
      await ContentSubmissionModel.create({
        userId: user._id,
        platform: body.platform,
        links: body.links,
        dayKey: nptDayKey(now),
      });
    } catch (error) {
      // Unique index (userId + dayKey): already submitted today
      if ((error as { code?: number }).code === 11000) {
        return {
          status: 400,
          body: {
            success: false,
            message: 'You have already submitted today. Come back tomorrow.',
          },
        };
      }
      throw error;
    }

    return {
      status: 201,
      body: { success: true, message: 'Content submitted successfully' },
    };
  } catch (error) {
    return serverError(error, 'Failed to submit content');
  }
};

const loadLeaders = async () => {
  const leaders = await ContentLeaderModel.find()
    .sort({ weekStart: -1, weekEnd: -1, rank: 1 })
    .limit(500)
    .populate('userId', 'firstName lastName profilePicture')
    .populate('submissionId', 'platform links')
    .lean();

  return leaders
    .filter((l: any) => l.submissionId)
    .map((l: any) => ({
      _id: l._id.toString(),
      rank: l.rank,
      weekStart: l.weekStart,
      weekEnd: l.weekEnd,
      userName: fullName(l.userId),
      profilePicture: l.userId?.profilePicture ?? null,
      platform: l.submissionId.platform,
      links: l.submissionId.links as string[],
      postImage: l.postImage ?? null,
      rewardAmount: l.rewardAmount ?? 0,
    }));
};

const getContentLeaderboard: AppRouteImplementationOrOptions<
  typeof contentRewardContract.getContentLeaderboard
> = async () => {
  try {
    return { status: 200, body: await loadLeaders() };
  } catch (error) {
    return serverError(error, 'Failed to fetch leaderboard');
  }
};

const getContentRewardStatement: AppRouteImplementationOrOptions<
  typeof contentRewardContract.getContentRewardStatement
> = async ({ req }) => {
  try {
    const userId = getUserId(req);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return {
        status: 401,
        body: { success: false, message: 'Unauthorized' },
      };
    }

    // One row per paid selection (the reward is credited when it is created)
    const paid = await ContentLeaderModel.find({
      userId,
      rewardAmount: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate('submissionId', 'platform')
      .lean();

    return {
      status: 200,
      body: paid
        .filter((l: any) => l.submissionId)
        .map((l: any) => ({
          _id: l._id.toString(),
          amount: l.rewardAmount,
          rank: l.rank,
          weekStart: l.weekStart,
          weekEnd: l.weekEnd,
          platform: l.submissionId.platform,
          creditedAt: l.createdAt.toISOString(),
        })),
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch content reward statement');
  }
};

// --------------------------------------------------------------- admin

const getContentSubmissionsForAdmin: AppRouteImplementationOrOptions<
  typeof contentRewardContract.getContentSubmissionsForAdmin
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);

    // Date filter is in Nepal dates, both ends inclusive
    const createdAt: { $gte?: Date; $lt?: Date } = {};
    if (query?.from) createdAt.$gte = nptDayStart(query.from);
    if (query?.to) {
      createdAt.$lt = new Date(nptDayStart(query.to).getTime() + DAY_MS);
    }
    const filter = Object.keys(createdAt).length ? { createdAt } : {};

    const [totalRecords, submissions] = await Promise.all([
      ContentSubmissionModel.countDocuments(filter),
      ContentSubmissionModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'firstName lastName email phoneNumber')
        .lean(),
    ]);

    const leaders = await ContentLeaderModel.find({
      submissionId: { $in: submissions.map((s) => s._id) },
    }).lean();
    const leaderBySubmission = new Map(
      leaders.map((l) => [l.submissionId.toString(), l])
    );

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data: submissions.map((s: any) => {
          const leader = leaderBySubmission.get(s._id.toString());
          return {
            _id: s._id.toString(),
            user: {
              _id: s.userId?._id?.toString() ?? '',
              fullName: fullName(s.userId),
              email: s.userId?.email ?? 'N/A',
              phoneNumber: s.userId?.phoneNumber ?? 'N/A',
            },
            platform: s.platform,
            links: s.links,
            submittedAt: s.createdAt.toISOString(),
            leader: leader
              ? {
                  rank: leader.rank,
                  weekStart: leader.weekStart,
                  weekEnd: leader.weekEnd,
                  rewardAmount: leader.rewardAmount ?? 0,
                }
              : null,
          };
        }),
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to fetch content submissions');
  }
};

const selectContentLeader: AppRouteImplementationOrOptions<
  typeof contentRewardContract.selectContentLeader
> = async ({ body }) => {
  try {
    if (body.weekStart > body.weekEnd) {
      return {
        status: 400,
        body: { success: false, message: 'Week start must be before week end' },
      };
    }
    if (!mongoose.isValidObjectId(body.submissionId)) {
      return {
        status: 404,
        body: { success: false, message: 'Submission not found' },
      };
    }
    const submission = await ContentSubmissionModel.findById(
      body.submissionId
    ).lean();
    if (!submission) {
      return {
        status: 404,
        body: { success: false, message: 'Submission not found' },
      };
    }

    const rewardAmount = body.rewardAmount ?? 0;

    let leader;
    try {
      leader = await ContentLeaderModel.create({
        submissionId: submission._id,
        userId: submission.userId,
        rank: body.rank,
        weekStart: body.weekStart,
        weekEnd: body.weekEnd,
        postImage: body.postImage,
        rewardAmount,
      });
    } catch (error) {
      // The image was already uploaded by the middleware; don't leave it orphaned
      if (body.postImage) await cleanupR2Uploads([body.postImage]);
      if ((error as { code?: number }).code === 11000) {
        return {
          status: 400,
          body: {
            success: false,
            message:
              'This submission is already a leader, or that rank is already taken for this week',
          },
        };
      }
      throw error;
    }

    // Pay the reward into the user's earnings (shows in Today's Earning and
    // the earning dashboard). If the payment fails, undo the selection so the
    // admin can retry without the user being a leader but unpaid.
    if (rewardAmount > 0) {
      try {
        await balanceModel.updateOne(
          { userId: submission.userId },
          { $inc: { balance: rewardAmount, totalEarnings: rewardAmount } },
          { upsert: true }
        );
        await EarningStatementModel.create({
          userId: submission.userId,
          type: 'CONTENT_REWARD',
          earning: rewardAmount,
          balanceWallet: rewardAmount,
          srkBonus: 0,
          eventWallet: 0,
          ceoSalary: 0,
          officeManagementCharge: 0,
          companyTurnover: 0,
          tms: 0,
          vat: 0,
        });
      } catch (error) {
        console.error('Failed to credit content reward', error);
        // Best-effort rollback of whichever half was applied
        await ContentLeaderModel.findByIdAndDelete(leader._id);
        if (body.postImage) await cleanupR2Uploads([body.postImage]);
        return serverError(error, 'Failed to credit content reward');
      }
    }

    return {
      status: 201,
      body: { success: true, message: 'Leader selected' },
    };
  } catch (error) {
    return serverError(error, 'Failed to select leader');
  }
};

const getContentLeadersForAdmin: AppRouteImplementationOrOptions<
  typeof contentRewardContract.getContentLeadersForAdmin
> = async () => {
  try {
    return { status: 200, body: await loadLeaders() };
  } catch (error) {
    return serverError(error, 'Failed to fetch leaders');
  }
};

const removeContentLeader: AppRouteImplementationOrOptions<
  typeof contentRewardContract.removeContentLeader
> = async ({ params }) => {
  try {
    const leader = mongoose.isValidObjectId(params.leaderId)
      ? await ContentLeaderModel.findById(params.leaderId)
      : null;
    if (!leader) {
      return {
        status: 404,
        body: { success: false, message: 'Leader not found' },
      };
    }
    // A paid reward is already in the user's earnings; removing the leader
    // would not take it back, so block it rather than leave them out of sync.
    if ((leader.rewardAmount ?? 0) > 0) {
      return {
        status: 400,
        body: {
          success: false,
          message:
            'This leader has already been paid a reward and cannot be removed',
        },
      };
    }
    await leader.deleteOne();
    return { status: 200, body: { success: true, message: 'Leader removed' } };
  } catch (error) {
    return serverError(error, 'Failed to remove leader');
  }
};

const setContentUploadPermission: AppRouteImplementationOrOptions<
  typeof contentRewardContract.setContentUploadPermission
> = async ({ params, body }) => {
  try {
    const user = mongoose.isValidObjectId(params.userId)
      ? await UserModel.findByIdAndUpdate(params.userId, {
          canUploadContent: body.canUpload,
        })
      : null;
    if (!user) {
      return {
        status: 404,
        body: { success: false, message: 'User not found' },
      };
    }
    return {
      status: 200,
      body: {
        success: true,
        message: body.canUpload
          ? 'User can now upload content'
          : 'User can no longer upload content',
      },
    };
  } catch (error) {
    return serverError(error, 'Failed to update permission');
  }
};

export const contentRewardHandler = {
  getContentSubmissionStatus,
  submitContent,
  getContentLeaderboard,
  getContentRewardStatement,
  getContentSubmissionsForAdmin,
  selectContentLeader,
  getContentLeadersForAdmin,
  removeContentLeader,
  setContentUploadPermission,
};
