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
  nptWeekOf,
  nptWeekOfDate,
} from '../../utils/nepalTime';

const DAY_MS = 24 * 60 * 60 * 1000;

// The most (in NRS) an admin can reward one leader
const MAX_REWARD_NRS = 500;

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

const getMyContentSubmissions: AppRouteImplementationOrOptions<
  typeof contentRewardContract.getMyContentSubmissions
> = async ({ req }) => {
  try {
    const userId = getUserId(req);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return {
        status: 401,
        body: { success: false, message: 'Unauthorized' },
      };
    }

    const submissions = await ContentSubmissionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(400)
      .lean();

    const currentWeek = nptWeekOfDate(new Date()).weekStart;
    const byWeek = new Map<
      string,
      { weekEnd: string; items: typeof submissions }
    >();
    for (const s of submissions) {
      const w = nptWeekOfDate(s.createdAt);
      const entry = byWeek.get(w.weekStart) ?? { weekEnd: w.weekEnd, items: [] };
      entry.items.push(s);
      byWeek.set(w.weekStart, entry);
    }
    const weekStarts = [...byWeek.keys()];

    // This user's own wins, and which of these weeks have any decision at all
    const [myLeaders, decidedWeeks] = await Promise.all([
      ContentLeaderModel.find({ userId, weekStart: { $in: weekStarts } }).lean(),
      ContentLeaderModel.distinct('weekStart', { weekStart: { $in: weekStarts } }),
    ]);
    const decided = new Set<string>(decidedWeeks);
    const leaderBySubmission = new Map(
      myLeaders.map((l) => [l.submissionId.toString(), l])
    );
    const leaderByWeek = new Map(myLeaders.map((l) => [l.weekStart, l]));

    const weeks = weekStarts
      .sort((a, b) => (a < b ? 1 : -1))
      .map((weekStart) => {
        const entry = byWeek.get(weekStart)!;
        const win = leaderByWeek.get(weekStart);
        return {
          weekStart,
          weekEnd: entry.weekEnd,
          isCurrent: weekStart === currentWeek,
          decisionMade: decided.has(weekStart),
          result: win
            ? { rank: win.rank, rewardAmount: win.rewardAmount ?? 0 }
            : null,
          submissions: entry.items.map((s) => ({
            _id: s._id.toString(),
            platform: s.platform,
            links: s.links as string[],
            submittedAt: s.createdAt.toISOString(),
            leaderRank: leaderBySubmission.get(s._id.toString())?.rank ?? null,
          })),
        };
      });

    return { status: 200, body: weeks };
  } catch (error) {
    return serverError(error, 'Failed to fetch your submissions');
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

const getContentSubmissionsByWeek: AppRouteImplementationOrOptions<
  typeof contentRewardContract.getContentSubmissionsByWeek
> = async ({ query }) => {
  try {
    const today = nptDayKey(new Date());
    const currentWeek = nptWeekOf(today).weekStart;

    // Whole weeks only: the range is widened to the Sunday before / Saturday after
    const fromKey =
      query?.from ??
      nptWeekOf(
        nptDayKey(new Date(nptDayStart(today).getTime() - 7 * DAY_MS))
      ).weekStart;
    const toKey = query?.to ?? today;
    const rangeStart = nptDayStart(nptWeekOf(fromKey).weekStart);
    const rangeEnd = new Date(
      nptDayStart(nptWeekOf(toKey).weekEnd).getTime() + DAY_MS
    );

    const submissions = await ContentSubmissionModel.find({
      createdAt: { $gte: rangeStart, $lt: rangeEnd },
    })
      .sort({ createdAt: -1 })
      .limit(5000)
      .populate('userId', 'firstName lastName email phoneNumber')
      .lean();

    const weekStarts = [
      ...new Set(submissions.map((s) => nptWeekOfDate(s.createdAt).weekStart)),
    ];
    const leaders = await ContentLeaderModel.find({
      weekStart: { $in: weekStarts },
    })
      .populate('userId', 'firstName lastName')
      .lean();
    const leaderBySubmission = new Map(
      leaders.map((l) => [l.submissionId.toString(), l])
    );

    type UserRow = {
      userId: string;
      fullName: string;
      email: string;
      phoneNumber: string;
      submissions: {
        _id: string;
        platform: any;
        links: string[];
        submittedAt: string;
        leader: { rank: number; rewardAmount: number } | null;
      }[];
    };
    const weeks = new Map<
      string,
      { weekEnd: string; users: Map<string, UserRow>; total: number }
    >();

    for (const s of submissions as any[]) {
      const w = nptWeekOfDate(s.createdAt);
      const week = weeks.get(w.weekStart) ?? {
        weekEnd: w.weekEnd,
        users: new Map<string, UserRow>(),
        total: 0,
      };
      const uid = s.userId?._id?.toString() ?? 'unknown';
      const row = week.users.get(uid) ?? {
        userId: uid,
        fullName: fullName(s.userId),
        email: s.userId?.email ?? 'N/A',
        phoneNumber: s.userId?.phoneNumber ?? 'N/A',
        submissions: [],
      };
      const lead = leaderBySubmission.get(s._id.toString());
      row.submissions.push({
        _id: s._id.toString(),
        platform: s.platform,
        links: s.links,
        submittedAt: s.createdAt.toISOString(),
        leader: lead
          ? { rank: lead.rank, rewardAmount: lead.rewardAmount ?? 0 }
          : null,
      });
      week.users.set(uid, row);
      week.total += 1;
      weeks.set(w.weekStart, week);
    }

    const body = [...weeks.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([weekStart, week]) => ({
        weekStart,
        weekEnd: week.weekEnd,
        isCurrent: weekStart === currentWeek,
        totalSubmissions: week.total,
        leaders: leaders
          .filter((l) => l.weekStart === weekStart)
          .sort((a, b) => a.rank - b.rank)
          .map((l: any) => ({
            leaderId: l._id.toString(),
            rank: l.rank,
            userName: fullName(l.userId),
            rewardAmount: l.rewardAmount ?? 0,
          })),
        users: [...week.users.values()].sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        ),
      }));

    return { status: 200, body };
  } catch (error) {
    return serverError(error, 'Failed to fetch submissions by week');
  }
};

const selectContentLeader: AppRouteImplementationOrOptions<
  typeof contentRewardContract.selectContentLeader
> = async ({ body }) => {
  try {
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

    // Whole paisa only, and never above the cap, even if the contract is out of date
    const rewardAmount = Math.round((body.rewardAmount ?? 0) * 100) / 100;
    if (rewardAmount < 0 || rewardAmount > MAX_REWARD_NRS) {
      if (body.postImage) await cleanupR2Uploads([body.postImage]);
      return {
        status: 400,
        body: {
          success: false,
          message: `Reward amount must be between 0 and NRS ${MAX_REWARD_NRS}`,
        },
      };
    }

    // The week is the one the content was submitted in (Sunday - Saturday, Nepal)
    const { weekStart, weekEnd } = nptWeekOfDate(submission.createdAt);

    // One place per user per week
    if (await ContentLeaderModel.exists({ userId: submission.userId, weekStart })) {
      if (body.postImage) await cleanupR2Uploads([body.postImage]);
      return {
        status: 400,
        body: {
          success: false,
          message: 'This user is already a leader for this week',
        },
      };
    }

    let leader;
    try {
      leader = await ContentLeaderModel.create({
        submissionId: submission._id,
        userId: submission.userId,
        rank: body.rank,
        weekStart,
        weekEnd,
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
      let balanceApplied = false;
      try {
        await balanceModel.updateOne(
          { userId: submission.userId },
          { $inc: { balance: rewardAmount, totalEarnings: rewardAmount } },
          { upsert: true }
        );
        balanceApplied = true;
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
        // Undo every half that was applied so no money is left behind
        if (balanceApplied) {
          await balanceModel.updateOne(
            { userId: submission.userId },
            { $inc: { balance: -rewardAmount, totalEarnings: -rewardAmount } }
          );
        }
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

const setContentLeaderImage: AppRouteImplementationOrOptions<
  typeof contentRewardContract.setContentLeaderImage
> = async ({ req, params, body }) => {
  const newKeys = ((req as { uploadedR2Keys?: string[] }).uploadedR2Keys ?? []).slice();
  try {
    const leader = mongoose.isValidObjectId(params.leaderId)
      ? await ContentLeaderModel.findById(params.leaderId)
      : null;
    if (!leader) {
      await cleanupR2Uploads(newKeys);
      return {
        status: 404,
        body: { success: false, message: 'Leader not found' },
      };
    }
    // If the upload step did not turn the picture into a stored file, refuse
    if (body.postImage.startsWith('data:')) {
      return {
        status: 400,
        body: { success: false, message: 'The image could not be saved. Try again.' },
      };
    }

    const oldImage = leader.postImage;
    leader.postImage = body.postImage;
    await leader.save();

    if (oldImage && oldImage !== body.postImage && !/^https?:\/\//i.test(oldImage)) {
      await cleanupR2Uploads([oldImage]);
    }
    return { status: 200, body: { success: true, message: 'Image updated' } };
  } catch (error) {
    await cleanupR2Uploads(newKeys);
    return serverError(error, 'Failed to update leader image');
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
  getMyContentSubmissions,
  getContentSubmissionsForAdmin,
  getContentSubmissionsByWeek,
  selectContentLeader,
  getContentLeadersForAdmin,
  setContentLeaderImage,
  removeContentLeader,
  setContentUploadPermission,
};
