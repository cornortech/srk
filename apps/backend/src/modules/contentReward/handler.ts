import { contentRewardContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import mongoose from 'mongoose';
import { ContentSubmissionModel } from '../../model/contentSubmissionModel';
import { ContentLeaderModel } from '../../model/contentLeaderModel';
import { UserModel } from '../../model/userModel';
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

    try {
      await ContentLeaderModel.create({
        submissionId: submission._id,
        userId: submission.userId,
        rank: body.rank,
        weekStart: body.weekStart,
        weekEnd: body.weekEnd,
      });
    } catch (error) {
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
    const removed = mongoose.isValidObjectId(params.leaderId)
      ? await ContentLeaderModel.findByIdAndDelete(params.leaderId)
      : null;
    if (!removed) {
      return {
        status: 404,
        body: { success: false, message: 'Leader not found' },
      };
    }
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
  getContentSubmissionsForAdmin,
  selectContentLeader,
  getContentLeadersForAdmin,
  removeContentLeader,
  setContentUploadPermission,
};
