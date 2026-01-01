import mongoose from 'mongoose';
import { srkTaskContract } from '@srk/shared/contracts';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { srkTaskUserModel } from '../../../model/task/srkTaskUserModel';
import { srkTaskActionSubmissionModel } from '../../../model/task/srkTaskActionSubmissionModel';
import { srkTaskEarningStatementModel } from '../../../model/task/srkTaskEarningStatementModel';
import { srkTasksEarningsPayoutModel } from '../../../model/task/srkTasksEarningsPayoutModel';
import { srkTaskOnboardingVerificationRequestModel } from '../../../model/task/srkTaskOnboardingVerificationRequestModel';
import { IUser } from '../../../model/userModel';
import { srkTaskUserBalanceModel } from '../../../model/task/srkTaskUserBalanceModel';
import { growPackageTodoModel } from '../../../model/growPackageTodoModel';
import { growSocialMediaPackageEnrollmentModel } from '../../../model/growSocialMediaPackageEnrollment';

const getAllSrkTasksActionSubmissionByStatusForAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getAllSrkTasksActionSubmissionByStatusForAdmin
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;
    const status = query?.status;

    const filter = status ? { status } : {};

    const [totalRecords, submissions] = await Promise.all([
      srkTaskActionSubmissionModel.countDocuments(filter),
      srkTaskActionSubmissionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate<{
          growEnrollmentId: any;
          // growEnrollmentId:{
          //  growSocialMediaPackageId : Pick<IGrowSocialMediaPackage,"_id"|"name"|"description"|"socialMediaPlatforms"|"amount">;
          // growSocialMediaPackageTypeId : Pick<IGrowSocialMediaPackageType,"_id"|"name"|"description"|"amount">;
          //  growSocialMediaPackageSubTypeId : Pick<IGrowSocialMediaPackageSubType,"_id"|"name"|"description"|"taskType"|"noOfLikes"|"noOfVideos"|"noOfFollowers">;
          // }
        }>({
          path: 'growEnrollmentId',
          populate: [
            { path: 'growSocialMediaPackageId' },
            { path: 'growSocialMediaPackageTypeId' },
            { path: 'growSocialMediaPackageSubTypeId' },
          ],
        })
        .lean(),
    ]);

    const data = submissions.map((submission) => {
      const e = submission.growEnrollmentId;
      return {
        _id: submission._id.toString(),
        description: submission.description,
        taskUserId: submission.taskUserId.toString(),
        growEnrollmentId: e
          ? {
              _id: e._id.toString(),
              socialMediaPlatform: e.socialMediaPlatform,
              profileLinkURL: e.profileLinkURL || [],
              amount: e.amount,
              isActive: e.isActive,
              createdAt: e.createdAt?.toISOString?.() || '',
              updatedAt: e.updatedAt?.toISOString?.() || '',
              growSocialMediaPackageId: e.growSocialMediaPackageId
                ? {
                    _id: e.growSocialMediaPackageId._id?.toString?.() || '',
                    name: e.growSocialMediaPackageId.name,
                    description: e.growSocialMediaPackageId.description,
                    socialMediaPlatforms:
                      e.growSocialMediaPackageId.socialMediaPlatforms || [],
                    amount: e.growSocialMediaPackageId.amount,
                  }
                : undefined,
              growSocialMediaPackageTypeId: e.growSocialMediaPackageTypeId
                ? {
                    _id: e.growSocialMediaPackageTypeId._id?.toString?.() || '',
                    name: e.growSocialMediaPackageTypeId.name,
                    description: e.growSocialMediaPackageTypeId.description,
                    amount: e.growSocialMediaPackageTypeId.amount,
                  }
                : undefined,
              growSocialMediaPackageSubTypeId: e.growSocialMediaPackageSubTypeId
                ? {
                    _id:
                      e.growSocialMediaPackageSubTypeId._id?.toString?.() || '',
                    name: e.growSocialMediaPackageSubTypeId.name,
                    description: e.growSocialMediaPackageSubTypeId.description,
                    taskType: e.growSocialMediaPackageSubTypeId.taskType,
                    noOfLikes: e.growSocialMediaPackageSubTypeId.noOfLikes,
                    noOfVideos: e.growSocialMediaPackageSubTypeId.noOfVideos,
                    noOfFollowers:
                      e.growSocialMediaPackageSubTypeId.noOfFollowers,
                  }
                : undefined,
            }
          : undefined,
        screenshotUrl: submission.screenshotUrl,
        status: submission.status,
        rejectionReason: submission.rejectionReason || null,
        createdAt: submission.createdAt?.toISOString?.() || '',
        updatedAt: submission.updatedAt?.toISOString?.() || '',
      };
    });

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};
const getSrkTaskUserProfile: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getSrkTaskUserProfile
> = async ({ params }) => {
  try {
    const { userId } = params;
    const taskUserId = new mongoose.Types.ObjectId(userId);

    // Populate university user
    const profile = await srkTaskUserModel
      .findById(taskUserId)
      .populate<{ srkUniversityUserId: IUser }>('srkUniversityUserId')
      .lean();

    if (!profile) {
      return {
        status: 404,
        body: {
          message: 'SRK Task user not found',
          success: false,
        },
      };
    }

    const totalTasksCompleted =
      await srkTaskActionSubmissionModel.countDocuments({
        taskUserId,
        status: 'approved',
      });

    const totalCoinsEarnedAgg = await srkTaskEarningStatementModel.aggregate([
      {
        $match: {
          taskUserId,
          type: 'credit',
        },
      },
      {
        $group: {
          _id: null,
          totalCoins: {
            $sum: '$coin',
          },
        },
      },
    ]);
    const totalCoinsEarned = totalCoinsEarnedAgg[0]?.totalCoins ?? 0;

    const totalEarningsAgg = await srkTasksEarningsPayoutModel.aggregate([
      {
        $match: {
          taskUserId,
          status: 'approved',
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: {
            $sum: '$amount',
          },
        },
      },
    ]);
    const totalEarnings = totalEarningsAgg[0]?.totalEarnings ?? 0;

    const latestKyc = await srkTaskOnboardingVerificationRequestModel
      .findOne({ taskUserId })
      .sort({ createdAt: -1 })
      .lean();

    const daysSinceJoin = Math.max(
      Math.floor(
        (Date.now() - new Date(profile.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      1
    );

    const totalTasksSubmitted =
      await srkTaskActionSubmissionModel.countDocuments({
        taskUserId,
      });

    const successRate =
      totalTasksSubmitted > 0
        ? (totalTasksCompleted / totalTasksSubmitted) * 100
        : 0;

    return {
      status: 200,
      body: {
        userData: {
          _id: profile._id.toString(),
          srkUniversityUserId: profile.srkUniversityUserId._id.toString(),
          fullName: profile.fullName,
          phone: profile.srkUniversityUserId.phoneNumber,
          email: profile.srkUniversityUserId.email,
          isActivated: profile.isActivated,
          kycStatus: latestKyc?.status,
          createdAt: profile.createdAt.toLocaleString(),
        },
        taskData: {
          totalTasksCompleted,
          totalCoinsEarned,
          totalEarnings,
          avgDailyEarn: totalCoinsEarned / daysSinceJoin,
          successRate,
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

const getSrkTaskUserAnalytics: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getSrkTaskUserAnalytics
> = async ({ params }) => {
  try {
    const { userId } = params;

    const taskUserId = new mongoose.Types.ObjectId(userId);

    const profile = await srkTaskUserModel.findById(taskUserId).lean();
    if (!profile) {
      return {
        status: 404,
        body: {
          message: 'User not found',
          success: false,
        },
      };
    }

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));

    const coinEarningStats = await srkTaskEarningStatementModel.aggregate([
      {
        $match: {
          taskUserId,
          type: 'credit',
        },
      },
      // Sum total/all-time, today, last7, last28
      {
        $group: {
          _id: null,
          allTimeCoins: {
            $sum: '$coin',
          },
          today: {
            $sum: {
              $cond: [
                {
                  $gte: ['$createdAt', startOfToday],
                },
                '$coin',
                0,
              ],
            },
          },
          yesterday: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: [
                        '$createdAt',
                        new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000),
                      ],
                    },
                    { $lt: ['$createdAt', startOfToday] },
                  ],
                },
                '$coin',
                0,
              ],
            },
          },
          last7Days: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$createdAt',
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  ],
                },
                '$coin',
                0,
              ],
            },
          },
          prev7Days: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: [
                        '$createdAt',
                        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    {
                      $lt: [
                        '$createdAt',
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                      ],
                    },
                  ],
                },
                '$coin',
                0,
              ],
            },
          },
          last28Days: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$createdAt',
                    new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
                  ],
                },
                '$coin',
                0,
              ],
            },
          },
          prev28Days: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $gte: [
                        '$createdAt',
                        new Date(Date.now() - 56 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    {
                      $lt: [
                        '$createdAt',
                        new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
                      ],
                    },
                  ],
                },
                '$coin',
                0,
              ],
            },
          },
        },
      },
    ]);

    const coinStats = coinEarningStats[0] ?? {};

    const peakDayCoinsAgg = await srkTaskEarningStatementModel.aggregate([
      {
        $match: {
          taskUserId,
          type: 'credit',
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: '$createdAt',
            },
            month: {
              $month: '$createdAt',
            },
            day: {
              $dayOfMonth: '$createdAt',
            },
          },
          dailyCoins: {
            $sum: '$coin',
          },
        },
      },
      { $sort: { dailyCoins: -1 } },
      { $limit: 1 },
    ]);

    const peakDayCoins = peakDayCoinsAgg[0]?.dailyCoins ?? 0;

    // Task stats aggregation
    const taskStatsAgg = await srkTaskActionSubmissionModel.aggregate([
      {
        $match: {
          taskUserId,
        },
      },
      {
        $group: {
          _id: null,
          totalTasks: {
            $sum: 1,
          },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ['$status', 'approved'] }, 1, 0],
            },
          },
        },
      },
    ]);

    const taskStats = taskStatsAgg[0] ?? { totalTasks: 0, completedTasks: 0 };
    const taskCompletionRate = taskStats.totalTasks
      ? (taskStats.completedTasks / taskStats.totalTasks) * 100
      : 0;

    const daysSinceJoin = Math.max(
      Math.floor(
        (Date.now() - new Date(profile.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      1
    );
    const averageDailyCoins = coinStats.allTimeCoins
      ? coinStats.allTimeCoins / daysSinceJoin
      : 0;

    // Wallet coins
    const profileBalance = await srkTaskUserBalanceModel
      .findOne({ taskUserId })
      .lean();

    const getPercentageChange = (current = 0, previous = 0) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    const percentageChanges = {
      today: getPercentageChange(coinStats.today, coinStats.yesterday),
      last7Days: getPercentageChange(coinStats.last7Days, coinStats.prev7Days),
      last28Days: getPercentageChange(
        coinStats.last28Days,
        coinStats.prev28Days
      ),
    };

    return {
      status: 200,
      body: {
        coinsData: {
          walletCoins: profileBalance?.currentCoins ?? 0,
          today: coinStats.today ?? 0,
          todayChange: percentageChanges.today,
          last7Days: coinStats.last7Days ?? 0,
          last7DaysChange: percentageChanges.last7Days,
          last28Days: coinStats.last28Days ?? 0,
          last28DaysChange: percentageChanges.last28Days,
          allTimeCoins: coinStats.allTimeCoins ?? 0,
        },
        tasksData: {
          averageDailyCoins,
          peakDayCoins,
          taskCompletionRate,
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

const getStartDateFromTimeRange = (timeRange: 'weekly' | 'monthly' | 'all') => {
  switch (timeRange) {
    case 'weekly':
      return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    case 'monthly':
      return new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
    case 'all':
    default:
      return null;
  }
};

const getAllSrkTaskUserEarningsLeaderboard: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getAllSrkTaskUserEarningsLeaderboard
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;
    const search = query?.search?.trim();

    const currentUserId = query?.currentUserId;

    const timeRange = query?.timeRange ?? 'all';

    // Time range filter
    const startDate = getStartDateFromTimeRange(timeRange);
    const dateFilter = startDate
      ? {
          createdAt: {
            $gte: startDate,
          },
        }
      : {};

    // Aggregate leaderboard
    const earningsLeaderboardAgg = await srkTaskEarningStatementModel.aggregate(
      [
        { $match: { type: 'credit', ...dateFilter } },
        {
          $group: {
            _id: '$taskUserId',
            coins: { $sum: '$coin' },
            firstActivity: { $min: '$createdAt' },
          },
        },
        {
          $lookup: {
            from: 'srktaskusers',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },

        // Add search filter if search query exists
        ...(search
          ? [
              {
                $match: {
                  'user.fullName': { $regex: search, $options: 'i' }, // case-insensitive
                },
              },
            ]
          : []),

        {
          $addFields: {
            fullName: '$user.fullName',
            consistencyDays: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), '$firstActivity'] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
          },
        },
        { $sort: { coins: -1 } },
        {
          $setWindowFields: {
            sortBy: { coins: -1 },
            output: { rank: { $rank: {} } },
          },
        },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            rank: 1,
            fullName: 1,
            coins: 1,
            consistencyDays: 1,
            change: { $literal: 0 },
          },
        },
      ]
    );

    // Total users for pagination
    const totalRecordsAgg = await srkTaskEarningStatementModel.aggregate([
      { $match: { type: 'credit', ...dateFilter } },
      { $group: { _id: '$taskUserId' } },
      { $count: 'totalUsers' },
    ]);

    const totalRecords = totalRecordsAgg[0]?.totalUsers ?? 0;
    const totalPages = Math.ceil(totalRecords / limit);

    // Current user stats
    let currentUser = null;
    if (currentUserId) {
      const userAgg = await srkTaskEarningStatementModel.aggregate([
        {
          $match: {
            taskUserId: new mongoose.Types.ObjectId(currentUserId),
            type: 'credit',
            ...dateFilter,
          },
        },
        {
          $group: {
            _id: '$taskUserId',
            coins: { $sum: '$coin' },
            firstActivity: { $min: '$createdAt' },
          },
        },
        {
          $lookup: {
            from: 'srktaskusers',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $addFields: {
            fullName: '$user.fullName',
            consistencyDays: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), '$firstActivity'] },
                  1000 * 60 * 60 * 24,
                ],
              },
            },
            change: 0,
          },
        },
        {
          $project: {
            _id: 0,
            fullName: 1,
            coins: 1,
            consistencyDays: 1,
            change: 1,
          },
        },
      ]);
      currentUser = userAgg[0] || null;
    }

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords: totalRecords,
        totalPages,
        data: {
          leaderboard: earningsLeaderboardAgg,
          currentUser,
          timeRange,
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message
          ? `Internal server error: ${error.message}`
          : 'Internal server error',
      },
    };
  }
};

const getAllSrkTaskEarningPayoutsByAdmin: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getAllSrkTaskEarningPayoutsByAdmin
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;
    const status = query?.status;

    // Find payout requests with optional status filter
    const filter = status ? { status } : {};
    const [totalRecords, payouts] = await Promise.all([
      srkTasksEarningsPayoutModel.countDocuments(filter),
      srkTasksEarningsPayoutModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'taskUserId',
          select: 'fullName srkUniversityUserId',
        }),
    ]);

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data: payouts.map((payout) => ({
          _id: payout._id.toString(),
          taskUserId: payout.taskUserId?._id.toString() || '',
          taskUserName: (payout.taskUserId as any)?.fullName || 'Unknown User',
          taskUserEmail:
            ((payout.taskUserId as any)?.srkUniversityUserId as any)?.email ||
            'Unknown Email',
          transactionId: payout.transactionId || null,
          coinsUsed: payout.coinsUsed,
          tds: payout.tds,
          amount: payout.amount,
          status: payout.status,
          paymentScreenshotUrl: payout.paymentScreenshotUrl || null,
          rejectionReason: payout.rejectionReason || null,
          createdAt: payout.createdAt.toISOString(),
          updatedAt: payout.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};

// Implementation for getAllSrkTaskEarningPayoutsByUser
const getSrkTaskUserEarningsPayoutsByUser: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getSrkTaskUserEarningsPayoutsByUser
> = async ({ params, query }) => {
  try {
    const userId = params?.userId;
    if (!userId) {
      return {
        status: 400,
        body: { success: false, message: 'Missing userId' },
      };
    }
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;
    const status = query?.status;

    const filter = { taskUserId: userId };
    if (status) filter['status'] = status;

    const [totalRecords, payouts] = await Promise.all([
      srkTasksEarningsPayoutModel.countDocuments(filter),
      srkTasksEarningsPayoutModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data: payouts.map((payout) => ({
          _id: payout._id.toString(),
          taskUserId: payout.taskUserId.toString(),
          amount: payout.amount,
          coinsUsed: payout.coinsUsed,
          tds: payout.tds,
          transactionId: payout.transactionId || null,
          status: payout.status,
          paymentScreenshotUrl: payout.paymentScreenshotUrl || null,
          rejectionReason: payout.rejectionReason || null,
          createdAt: payout.createdAt.toISOString(),
          updatedAt: payout.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};

const getAllSrkTaskUserFinanceStatement: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getAllSrkTaskUserFinanceStatement
> = async ({ params, query }) => {
  try {
    const { userId } = params;
    const taskUserId = new mongoose.Types.ObjectId(userId);

    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;
    const type = query?.type;

    const filter: any = { taskUserId };
    if (type) {
      filter.type = type;
    }

    const [totalRecords, earnings] = await Promise.all([
      srkTaskEarningStatementModel.countDocuments(filter),
      srkTaskEarningStatementModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data: earnings.map((earning) => ({
          _id: earning._id.toString(),
          taskUserId: earning.taskUserId.toString(),
          growPackageTodoId: earning.growPackageTodoId.toString(),
          description: earning.description,
          type: earning.type,
          coin: earning.coin,
          coinAfterTransaction: earning.coinAfterTransaction,
          createdAt: earning.createdAt.toISOString(),
          updatedAt: earning.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};

const getAllSrkTasksActionSubmissionsByUser: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getAllSrkTasksActionSubmissionsByUser
> = async ({ params, query }) => {
  try {
    const { userId } = params;
    const taskUserId = new mongoose.Types.ObjectId(userId);

    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;
    const status = query?.status;

    const filter: any = { taskUserId };
    if (status) {
      filter.status = status;
    }

    const [totalRecords, submissions] = await Promise.all([
      srkTaskActionSubmissionModel.countDocuments(filter),
      srkTaskActionSubmissionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate<{
          growEnrollmentId: any;
        }>({
          path: 'growEnrollmentId',
          populate: [
            { path: 'growSocialMediaPackageId' },
            { path: 'growSocialMediaPackageTypeId' },
            { path: 'growSocialMediaPackageSubTypeId' },
          ],
        })
        .lean(),
    ]);

    const data = submissions.map((submission) => {
      const e = submission.growEnrollmentId;
      return {
        _id: submission._id.toString(),
        taskUserId: submission.taskUserId.toString(),
        description: submission.description,
        growEnrollmentId: e
          ? {
              _id: e._id.toString(),
              socialMediaPlatform: e.socialMediaPlatform,
              profileLinkURL: e.profileLinkURL || [],
              amount: e.amount,
              isActive: e.isActive,
              createdAt: e.createdAt?.toISOString?.() || '',
              updatedAt: e.updatedAt?.toISOString?.() || '',
              growSocialMediaPackageId: e.growSocialMediaPackageId
                ? {
                    _id: e.growSocialMediaPackageId._id?.toString?.() || '',
                    name: e.growSocialMediaPackageId.name,
                    description: e.growSocialMediaPackageId.description,
                    socialMediaPlatforms:
                      e.growSocialMediaPackageId.socialMediaPlatforms || [],
                    amount: e.growSocialMediaPackageId.amount,
                  }
                : undefined,
              growSocialMediaPackageTypeId: e.growSocialMediaPackageTypeId
                ? {
                    _id: e.growSocialMediaPackageTypeId._id?.toString?.() || '',
                    name: e.growSocialMediaPackageTypeId.name,
                    description: e.growSocialMediaPackageTypeId.description,
                    amount: e.growSocialMediaPackageTypeId.amount,
                  }
                : undefined,
              growSocialMediaPackageSubTypeId: e.growSocialMediaPackageSubTypeId
                ? {
                    _id:
                      e.growSocialMediaPackageSubTypeId._id?.toString?.() || '',
                    name: e.growSocialMediaPackageSubTypeId.name,
                    description: e.growSocialMediaPackageSubTypeId.description,
                    taskType: e.growSocialMediaPackageSubTypeId.taskType,
                    noOfLikes: e.growSocialMediaPackageSubTypeId.noOfLikes,
                    noOfVideos: e.growSocialMediaPackageSubTypeId.noOfVideos,
                    noOfFollowers:
                      e.growSocialMediaPackageSubTypeId.noOfFollowers,
                  }
                : undefined,
            }
          : undefined,
        screenshotUrl: submission.screenshotUrl,
        status: submission.status,
        rejectionReason: submission.rejectionReason || null,
        createdAt: submission.createdAt?.toISOString?.() || '',
        updatedAt: submission.updatedAt?.toISOString?.() || '',
      };
    });

    return {
      status: 200,
      body: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        data,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};

const getSrkTaskActionsByPlatforms: AppRouteImplementationOrOptions<
  typeof srkTaskContract.getSrkTaskActionsByPlatforms
> = async ({ query }) => {
  try {
    const { platform, type, srkTaskUserId } = query;

    // add here paginations

    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;

    const queryFilter: any = {};
    if (platform) {
      queryFilter['platform'] = platform;
    }
    if (type) {
      queryFilter['type'] = type;
    }

    const growPackageEnrollments =
      await growSocialMediaPackageEnrollmentModel.find({
        isActive: true,
        type,
        socialMediaPlatform: platform,
      });

    const enrollmentIds = growPackageEnrollments.map((e) => e._id);

    // Get todos that have already been submitted by the user
    let submittedTodoIds: any[] = [];
    if (srkTaskUserId) {
      const taskUserId = new mongoose.Types.ObjectId(srkTaskUserId);
      const submissions = await srkTaskActionSubmissionModel
        .find({ taskUserId })
        .select('growPackageTodoId')
        .lean();
      submittedTodoIds = submissions.map((s) => s.growPackageTodoId);
    }

    // Build filter to exclude already submitted todos
    const todoFilter: any = {
      growSocialMediaPackageEnrollmentId: { $in: enrollmentIds },
    };
    if (submittedTodoIds.length > 0) {
      todoFilter._id = { $nin: submittedTodoIds };
    }

    const srkTaskTodos = await growPackageTodoModel
      .find(todoFilter)
      .populate<{
        growSocialMediaPackageEnrollmentId: {
          growSocialMediaPackageUserId: { fullName: string };
        };
      }>({
        path: 'growSocialMediaPackageEnrollmentId',
        populate: { path: 'growSocialMediaPackageUserId', select: 'fullName' },
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalSrkTodos = await growPackageTodoModel.countDocuments(todoFilter);

    return {
      status: 200,
      body: {
        data: srkTaskTodos.map((action) => ({
          actionId: action._id.toString(),
          socialMediaPlatform: action.platform,
          username:
            action.growSocialMediaPackageEnrollmentId
              .growSocialMediaPackageUserId.fullName,
          profileLinkURL: action.profileUrl,
          taskType: action.type,
          postUrl: action.postUrl,
        })),
        totalRecords: totalSrkTodos,
        limit,
        page,
        totalPages: Math.ceil(totalSrkTodos / limit),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || 'Internal server error',
      },
    };
  }
};

export const srkTaskQueryHandler = {
  getSrkTaskActionsByPlatforms,
  getSrkTaskUserProfile,
  getSrkTaskUserAnalytics,
  getAllSrkTaskUserEarningsLeaderboard,
  getAllSrkTaskEarningPayoutsByAdmin,
  getSrkTaskUserEarningsPayoutsByUser,
  getAllSrkTasksActionSubmissionByStatusForAdmin,
  getAllSrkTasksActionSubmissionsByUser,
  getAllSrkTaskUserFinanceStatement,
};
