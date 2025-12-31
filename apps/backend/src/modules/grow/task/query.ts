import { srkTaskContract } from "@srk/shared/contracts";
import { AppRouteImplementationOrOptions } from "@ts-rest/express/src/lib/types";
import { srkTaskUserModel } from "../../../model/task/srkTaskUserModel";
import mongoose from "mongoose";
import { srkTaskActionSubmissionModel } from "../../../model/task/srkTaskActionSubmissionModel";
import { srkTaskEarningStatementModel } from "../../../model/task/srkTaskEarningStatementModel";
import { srkTasksEarningsPayoutModel } from "../../../model/task/srkTasksEarningsPayoutModel";
import { srkTaskOnboardingVerificationRequestModel } from "../../../model/task/srkTaskOnboardingVerificationRequestModel";
import { IUser } from "../../../model/userModel";
import { srkTaskUserBalanceModel } from "../../../model/task/srkTaskUserBalanceModel";

const getSrkTaskUserProfile: AppRouteImplementationOrOptions<
    typeof srkTaskContract.getSrkTaskUserProfile
> = async ({ params }) => {
    try {
        const {
            userId
        } = params;
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
                    success: false
                },
            };
        }

        const totalTasksCompleted = await srkTaskActionSubmissionModel.countDocuments({
            taskUserId,
            status: 'approved',
        });

        const totalCoinsEarnedAgg = await srkTaskEarningStatementModel.aggregate([
            {
                $match: {
                    taskUserId, type: 'credit'
                }
            },
            {
                $group: {
                    _id: null, totalCoins: {
                        $sum: '$coin'
                    }
                }
            },
        ]);
        const totalCoinsEarned = totalCoinsEarnedAgg[0]?.totalCoins ?? 0;

        const totalEarningsAgg = await srkTasksEarningsPayoutModel.aggregate([
            {
                $match: {
                    taskUserId,
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: {
                        $sum: '$amount'
                    }
                }
            },
        ]);
        const totalEarnings = totalEarningsAgg[0]?.totalEarnings ?? 0;

        const latestKyc = await srkTaskOnboardingVerificationRequestModel.findOne({ taskUserId })
            .sort({ createdAt: -1 })
            .lean();

        const daysSinceJoin = Math.max(
            Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            1
        );

        const totalTasksSubmitted = await srkTaskActionSubmissionModel.countDocuments({
            taskUserId,
        });

        const successRate = totalTasksSubmitted > 0 ? (totalTasksCompleted / totalTasksSubmitted) * 100 : 0;

        return {
            status: 200,
            body: {
                userData: {
                    _id: profile._id.toString(),
                    srkUniversityUserId: profile.srkUniversityUserId._id.toString(),
                    fullName: profile.fullName,
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

const getSrkTaskUserAnalystics: AppRouteImplementationOrOptions<
    typeof srkTaskContract.getSrkTaskUserAnalystics
> = async ({ params }) => {
    try {
        const {
            userId
        } = params;

        const taskUserId = new mongoose.Types.ObjectId(userId);

        const profile = await srkTaskUserModel.findById(taskUserId).lean();
        if (!profile) {
            return {
                status: 404,
                body: {
                    message: 'User not found',
                    success: false
                }
            };
        }

        const coinEarningStats = await srkTaskEarningStatementModel.aggregate([
            {
                $match: {
                    taskUserId,
                    type: 'credit'
                }
            },
            // Sum total/all-time, today, last7, last28
            {
                $group: {
                    _id: null,
                    allTimeCoins: {
                        $sum: '$coin'
                    },
                    today: {
                        $sum: {
                            $cond: [
                                {
                                    $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))]
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
                                    $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]
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
                                    $gte: ['$createdAt', new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)]
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
                    type: 'credit'
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: '$createdAt'
                        },
                        month: {
                            $month: '$createdAt'
                        },
                        day: {
                            $dayOfMonth: '$createdAt'
                        }
                    },
                    dailyCoins: {
                        $sum: '$coin'
                    }
                }
            },
            { $sort: { dailyCoins: -1 } },
            { $limit: 1 }
        ]);

        const peakDayCoins = peakDayCoinsAgg[0]?.dailyCoins ?? 0;

        // Task stats aggregation
        const taskStatsAgg = await srkTaskActionSubmissionModel.aggregate([
            {
                $match: {
                    taskUserId
                }
            },
            {
                $group: {
                    _id: null,
                    totalTasks: {
                        $sum: 1
                    },
                    completedTasks: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'approved'] }, 1, 0]
                        }
                    },
                },
            }
        ]);

        const taskStats = taskStatsAgg[0] ?? { totalTasks: 0, completedTasks: 0 };
        const taskCompletionRate = taskStats.totalTasks
            ? (taskStats.completedTasks / taskStats.totalTasks) * 100
            : 0;

        const daysSinceJoin = Math.max(
            Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
            1
        );
        const averageDailyCoins = coinStats.allTimeCoins ? coinStats.allTimeCoins / daysSinceJoin : 0;

        // Wallet coins
        const profileBalance = await srkTaskUserBalanceModel.findOne({ taskUserId }).lean();

        return {
            status: 200,
            body: {
                coinsData: {
                    walletCoins: profileBalance?.totalCoins ?? 0,
                    today: coinStats.today ?? 0,
                    last7Days: coinStats.last7Days ?? 0,
                    last28Days: coinStats.last28Days ?? 0,
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
        const dateFilter = startDate ? {
            createdAt: {
                $gte: startDate
            }
        } : {};

        // Aggregate leaderboard
        const earningsLeaderboardAgg = await srkTaskEarningStatementModel.aggregate([
            { $match: { type: 'credit', ...dateFilter } },
            {
                $group: {
                    _id: '$taskUserId',
                    coins: {
                        $sum: '$coin'
                    },
                    firstActivity: {
                        $min: '$createdAt'
                    },
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
            {
                $unwind: '$user'
            },

            // Add search filter if search query exists
            ...(search
                ? [
                    {
                        $match: {
                            'user.fullName': {
                                $regex: search,
                                $options: 'i'
                            }, // case-insensitive
                        },
                    },
                ]
                : []),

            {
                $addFields: {
                    fullName: '$user.fullName',
                    consistencyDays: {
                        $floor: {
                            $divide: [{
                                $subtract: [new Date(), '$firstActivity']
                            },
                            1000 * 60 * 60 * 24],
                        },
                    },
                },
            },
            {
                $sort: {
                    coins: -1
                }
            },
            {
                $setWindowFields: {
                    sortBy: {
                        coins: -1
                    },
                    output: {
                        rank: {
                            $rank: {}
                        }
                    },
                },
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 0,
                    rank: 1,
                    fullName: 1,
                    coins: 1,
                    consistencyDays: 1,
                    change: {
                        $literal: 0
                    },
                },
            },
        ]);

        // Total users for pagination
        const totalRecordsAgg = await srkTaskEarningStatementModel.aggregate([
            {
                $match: {
                    type: 'credit',
                    ...dateFilter
                }
            },
            {
                $group: {
                    _id: '$taskUserId'
                }
            },
            {
                $count: 'totalUsers'
            },
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
                        ...dateFilter
                    }
                },
                {
                    $group: {
                        _id: '$taskUserId',
                        coins: {
                            $sum: '$coin'
                        },
                        firstActivity: {
                            $min: '$createdAt'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'srktaskusers',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                {
                    $unwind: '$user'
                },
                {
                    $addFields: {
                        fullName: '$user.fullName',
                        consistencyDays: {
                            $floor: {
                                $divide: [{
                                    $subtract: [new Date(),
                                        '$firstActivity']
                                }, 1000 * 60 * 60 * 24],
                            },
                        },
                        change: 0,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        rank: 1,
                        fullName: 1,
                        coins: 1,
                        consistencyDays: 1,
                        change: 1
                    }
                },
            ]);
            currentUser = userAgg[0] || null;
        };

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
}

export const srkTaskQueryHandler = {
    getSrkTaskUserProfile,
    getSrkTaskUserAnalystics,
    getAllSrkTaskUserEarningsLeaderboard,
}