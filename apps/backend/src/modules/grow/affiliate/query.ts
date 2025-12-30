import mongoose from 'mongoose';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growSrkAffiliateUserBalanceModel } from '../../../model/grow/growSrkAffiliateUserBalanceModel';
import { growSrkAffiliateEarningStatementModel } from '../../../model/grow/growSrkAffiliateEarningStatementModel';
import { growAffiliateContract } from '@srk/shared/contracts';
import { growSrkAffiliateUserEarningsPayoutModel } from '../../../model/grow/growSrkAffiliateUserEarningsPayoutModel';
import { growSocialMediaPackageUserModel, IGrowSocialMediaPackageUser } from '../../../model/growSocialMediaPackageUserModel'

const getGrowAffiliateUserComissionEarningsDashboard: AppRouteImplementationOrOptions<
  typeof growAffiliateContract.getGrowAffiliateUserComissionEarningsDashboard
> = async ({ params }) => {
  try {
    const { affiliateUserId } = params;

    if (!affiliateUserId) {
      return {
        status: 400,
        body: {
          message: 'User ID is required',
          success: false,
        },
      };
    }

    const affiliateObjectId = new mongoose.Types.ObjectId(affiliateUserId);

    // Fetch current balance
    const userBalance = await growSrkAffiliateUserBalanceModel.findOne({
      growSocialMediaPackageUserId: affiliateObjectId,
    });
    const currentBalance = userBalance?.wallet || 0;

    // -----------------------------
    // Timeframes
    // -----------------------------

    const now = new Date();

    // Start and end of today in UTC
    const startOfToday = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0, 0, 0, 0
    ));

    const endOfToday = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23, 59, 59, 999
    ));

    // Start and end of yesterday in UTC
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setUTCDate(startOfToday.getUTCDate() - 1);

    const endOfYesterday = new Date(endOfToday);
    endOfYesterday.setUTCDate(endOfToday.getUTCDate() - 1);

    // Last 7 days
    const startOf7Days = new Date(startOfToday);
    startOf7Days.setUTCDate(startOfToday.getUTCDate() - 6);

    // Previous 7 days
    const startOfPrev7Days = new Date(startOfToday);
    startOfPrev7Days.setUTCDate(startOfToday.getUTCDate() - 13);

    const endOfPrev7Days = new Date(endOfToday);
    endOfPrev7Days.setUTCDate(endOfToday.getUTCDate() - 7);

    // Last 28 days
    const startOf28Days = new Date(startOfToday);
    startOf28Days.setUTCDate(startOfToday.getUTCDate() - 27);

    // Previous 28 days
    const startOfPrev28Days = new Date(startOfToday);
    startOfPrev28Days.setUTCDate(startOfToday.getUTCDate() - 55);

    const endOfPrev28Days = new Date(endOfToday);
    endOfPrev28Days.setUTCDate(endOfToday.getUTCDate() - 28);

    // -----------------------------
    // Aggregate earnings
    // -----------------------------
    const earnings = await growSrkAffiliateEarningStatementModel.aggregate([
      { $match: { refferedBY: affiliateObjectId } },
      {
        $facet: {
          today: [
            { $match: { createdAt: { $gte: startOfToday, $lte: endOfToday } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          yesterday: [
            { $match: { createdAt: { $gte: startOfYesterday, $lte: endOfYesterday } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          last7Days: [
            { $match: { createdAt: { $gte: startOf7Days } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          prev7Days: [
            { $match: { createdAt: { $gte: startOfPrev7Days, $lte: endOfPrev7Days } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          last28Days: [
            { $match: { createdAt: { $gte: startOf28Days } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          prev28Days: [
            { $match: { createdAt: { $gte: startOfPrev28Days, $lte: endOfPrev28Days } } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          allTime: [
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          activeDates: [
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const data = earnings[0] || {};

    // -----------------------------
    // Growth calculation helper
    // -----------------------------
    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return parseFloat(((current - previous) / previous * 100).toFixed(2));
    };

    const todayTotal = data.today[0]?.total || 0;
    const yesterdayTotal = data.yesterday[0]?.total || 0;
    const last7Total = data.last7Days[0]?.total || 0;
    const prev7Total = data.prev7Days[0]?.total || 0;
    const last28Total = data.last28Days[0]?.total || 0;
    const prev28Total = data.prev28Days[0]?.total || 0;
    const allTimeTotal = data.allTime[0]?.total || 0;

    // -----------------------------
    // Active streak calculation
    // -----------------------------
    const activeDates = data.activeDates.map((d) => d._id).sort();
    let streak = 0;
    let maxStreak = 0;
    let lastDate: Date | null = null;

    for (const dateStr of activeDates) {
      const date = new Date(dateStr);
      if (!lastDate) {
        streak = 1;
      } else {
        const diff = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak += 1; // consecutive day
        else streak = 1; // reset streak
      }
      lastDate = date;
      if (streak > maxStreak) maxStreak = streak;
    }

    return {
      status: 200,
      body: {
        growSocialMediaPackageUserId: affiliateUserId,
        currentBalance,
        todayEarnings: { totalEarnings: todayTotal, growthPercentage: calcGrowth(todayTotal, yesterdayTotal) },
        last7DaysEarnings: { totalEarnings: last7Total, growthPercentage: calcGrowth(last7Total, prev7Total) },
        last28DaysEarnings: { totalEarnings: last28Total, growthPercentage: calcGrowth(last28Total, prev28Total) },
        allTimeEarnings: allTimeTotal,
        activeDaysStreak: maxStreak,
      },
    };
  } catch (error) {
    console.error('Error fetching affiliate earnings:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
      },
    };
  }
};

const getUserAffiliateSalesComissionEarnings: AppRouteImplementationOrOptions<
  typeof growAffiliateContract.getUserAffiliateSalesComissionEarnings
> = async ({ params }) => {
  try {
    const { affiliateUserId } = params;

    const affiliateSalesComissionResults =
      await growSrkAffiliateEarningStatementModel.aggregate([
        {
          $match: {
            refferedBY: new mongoose.Types.ObjectId(affiliateUserId),
          },
        },
        {
          $lookup: {
            from: 'growsocialmediapackages',
            localField: 'growSocialMediaPackageId',
            foreignField: '_id',
            as: 'package',
          },
        },
        {
          $unwind: '$package',
        },

        {
          $lookup: {
            from: 'growsocialmediapackageusers',
            localField: 'refferedTo',
            foreignField: '_id',
            as: 'referredUser',
          },
        },
        {
          $unwind: '$referredUser',
        },

        {
          $group: {
            _id: '$package._id',
            name: {
              $first: '$package.name',
            },
            price: {
              $first: '$package.amount',
            },
            totalEarnings: {
              $sum: '$amount',
            },
            totalPackageSales: {
              $sum: 1,
            },
            affiliateUsers: {
              $push: {
                _id: {
                  $toString: '$referredUser._id',
                },
                name: '$referredUser.fullName',
              },
            },
          },
        },

        {
          $sort: {
            name: 1,
          },
        },
      ]);

    // Compute totalRevenue and totalSales
    const totalRevenue = affiliateSalesComissionResults.reduce(
      (acc, pkg) => acc + pkg.totalEarnings,
      0
    );
    const totalSales = affiliateSalesComissionResults.reduce(
      (acc, pkg) => acc + pkg.totalPackageSales,
      0
    );

    const activePackages = affiliateSalesComissionResults.length;

    // Total customers = unique referred users across all packages
    const totalCustomers = new Set(
      affiliateSalesComissionResults.flatMap((pkg) =>
        pkg.affiliateUsers.map((u) => u._id)
      )
    ).size;

    return {
      status: 200,
      body: {
        totalSales,
        totalRevenue,
        activePackages,
        totalCustomers,
        users: affiliateSalesComissionResults.map((pkg) => ({
          name: pkg.name,
          price: pkg.price,
          affiliateSales: {
            earnings: pkg.totalEarnings,
            totalPackageSales: pkg.totalPackageSales,
          },
          affiliateUsers: pkg.affiliateUsers.map((u) => ({
            affiliateUserId: u._id,
            name: u.name,
          })),
        })),
      }
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        message: error.message || 'Internal server error',
        success: false,
      },
    };
  }
};

const getAllUsersAffiliateComissionLeaderBoard: AppRouteImplementationOrOptions<
  typeof growAffiliateContract.getAllUsersAffiliateComissionLeaderBoard
> = async ({ query }) => {
  try {
    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;

    const timeRange = query?.timeRange ?? 'all';

    const dateMatch: any = {};

    if (timeRange === 'today') {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      dateMatch.createdAt = {
        $gte: startOfToday
      };
    }

    if (timeRange === 'week') {
      const sevenDaysAgo = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000
      );

      dateMatch.createdAt = {
        $gte: sevenDaysAgo
      };
    }

    const affiliateLeaderboardResults =
      await growSrkAffiliateEarningStatementModel.aggregate([
        // Time filter FIRST (performance)
        ...(timeRange !== 'all'
          ? [{ $match: dateMatch }]
          : []),
        {
          $group: {
            _id: '$refferedBY',
            totalSales: {
              $sum: 1
            },
            totalRevenue: {
              $sum: '$amount'
            },
          },
        },

        {
          $lookup: {
            from: 'growsocialmediapackageusers',
            localField: '_id',
            foreignField: '_id',
            as: 'affiliateUser',
          },
        },
        {
          $unwind: '$affiliateUser'
        },

        {
          $match: {
            'affiliateUser.userType': 'affiliate',
          },
        },

        {
          $sort: {
            totalRevenue: -1,
          },
        },
        {
          $facet: {
            paginatedResults: [
              {
                $skip: skip
              },
              {
                $limit: limit
              }
            ],
            totalCount: [
              {
                $count: 'count'
              }
            ],
          },
        }
      ]);

    const totalRecords = affiliateLeaderboardResults[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      status: 200,
      body: {
        timeRange,
        data: affiliateLeaderboardResults[0].paginatedResults.map((affiliate, index) => ({
          rank: skip + index + 1,
          affiliateUsersStats: {
            affiliateUserId: affiliate.affiliateUser._id.toString(),
            name: affiliate.affiliateUser.fullName,
          },
          salesStats: {
            totalSales: affiliate.totalSales,
            totalRevenue: affiliate.totalRevenue,
          },
        })),
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
      },
    };
  }
};

const getGrowAffiliateUser: AppRouteImplementationOrOptions<typeof growAffiliateContract.getGrowAffiliateUser> = async ({ params }) => {
  try {
    const affiliateUserExist = await growSocialMediaPackageUserModel.findById({ _id: params.id })

    if (!affiliateUserExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: "Affiliate user not found",
        },
      }
    }

    // 2. Fetch wallet balance
    await growSrkAffiliateUserBalanceModel.findOne({
      growSocialMediaPackageUserId: affiliateUserExist._id
    });

    // 3. Aggregate total earnings
    const earningsAggregate = await growSrkAffiliateEarningStatementModel.aggregate([
      {
        $match:
        {
          refferedBY: affiliateUserExist._id

        }
      },
      {
        $group:
        {
          _id: null,
          totalAmount: {
            $sum: "$amount"
          }
        }
      }
    ]);

    const totalEarnings = earningsAggregate[0]?.totalAmount || 0;

    const totalReferrals = await growSocialMediaPackageUserModel.countDocuments({
      referredBy: affiliateUserExist._id
    });

    return {
      status: 200,
      body: {
        userData: {
          _id: affiliateUserExist._id.toString(),
          fullName: affiliateUserExist.fullName,
          email: affiliateUserExist.email,
          phone: affiliateUserExist.phone,
          userType: affiliateUserExist.userType,
          createdAt: affiliateUserExist.createdAt.toLocaleString(),
          isEmailNotifications: affiliateUserExist.isEmailNotifications ?? null,
          isPushNotifications: affiliateUserExist.isPushNotifications ?? null,
        },
        affiliateData: {
          totalAffiliates: totalReferrals,
          totalComissionRevenue: totalEarnings,
        },
      },
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message ? `Internal server error: ${error.message}` : "Internal server error",
      },
    }
  }
}

const getAllSrkAffiliateEarningPayoutForAdmin: AppRouteImplementationOrOptions<
  typeof growAffiliateContract.getSrkAffiliateEarningPayoutForAdmin
> = async ({ query }) => {
  try {
    // Implement the logic to get SRK affiliate earning payouts for admin
    // You can access the query parameters using 'query' parameter

    const page = Number(query?.page ?? 1);
    const limit = Number(query?.limit ?? 10);
    const skip = (page - 1) * limit;

    const queryFilter: any = {};

    if (query?.status) {
      queryFilter.status = query.status;
    }

    const payouts = await growSrkAffiliateUserEarningsPayoutModel
      .find(queryFilter)
      .populate<{
        growSocialMediaPackageUserId: Pick<
          IGrowSocialMediaPackageUser,
          '_id' | 'email' | 'fullName'
        >;
      }>('growSocialMediaPackageUserId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPayouts =
      await growSrkAffiliateUserEarningsPayoutModel.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalPayouts / limit);

    return {
      status: 200,
      body: {
        data: payouts.map((payout) => ({
          payoutId: payout._id.toString(),
          amount: payout.amount,
          paymentScreenshot: payout.paymentScreenshot,
          rejectionReason: payout.rejectionReason,
          status: payout.status,
          createdAt: payout.createdAt,
          updatedAt: payout.updatedAt,
          transactionId: payout.transactionId,
          user: {
            userId: payout.growSocialMediaPackageUserId._id.toString(),
            email: payout.growSocialMediaPackageUserId.email,
            username: payout.growSocialMediaPackageUserId.fullName,
          },
        })),
        page,
        limit,
        totalPages,
        totalRecords: totalPayouts,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const growAffiliateQueryHandler = {
  getGrowAffiliateUserComissionEarningsDashboard,
  getUserAffiliateSalesComissionEarnings,
  getAllUsersAffiliateComissionLeaderBoard,
  getGrowAffiliateUser,
  getAllSrkAffiliateEarningPayoutForAdmin,
};
