import mongoose from 'mongoose';
import { AppRouteImplementationOrOptions } from '@ts-rest/express/src/lib/types';
import { growSrkAffiliateUserBalanceModel } from '../../../model/grow/growSrkAffiliateUserBalanceModel';
import { growSrkAffiliateEarningStatementModel } from '../../../model/grow/growSrkAffiliateEarningStatementModel';
import { growAffiliateContract } from '@srk/shared/contracts';
import { growSrkAffiliateUserEarningsPayoutModel } from '../../../model/grow/growSrkAffiliateUserEarningsPayoutModel';
import { growSocialMediaPackageUserModel, IGrowSocialMediaPackageUser } from '../../../model/growSocialMediaPackageUserModel';

/**
 * Calculate total earnings for a date range
 */
const calculateEarningsForPeriod = async (
  growUserId: string,
  startDate: Date,
  endDate: Date
): Promise<number> => {
  try {
    const earnings = await growSrkAffiliateEarningStatementModel.aggregate([
      {
        $match: {
          refferedBY: growUserId,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$amount',
          },
        },
      },
    ]);

    return earnings.length > 0 ? earnings[0].total : 0;
  } catch (error) {
    console.error(`Error calculating earnings for period:`, error);
    return 0;
  }
};

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

    // Fetch current balance
    const userBalance = await growSrkAffiliateUserBalanceModel.findOne({
      growSocialMediaPackageUserId: affiliateUserId,
    });

    if (!userBalance) {
      return {
        status: 404,
        body: {
          message: 'Affiliate balance record not found',
          success: false,
        },
      };
    }

    // Calculate date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(today);
    endOfToday.setDate(endOfToday.getDate() + 1);
    endOfToday.setMilliseconds(-1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const twentyEightDaysAgo = new Date(today);
    twentyEightDaysAgo.setDate(twentyEightDaysAgo.getDate() - 28);

    // Fetch earnings for all periods in parallel
    const [todayEarnings, last7DaysEarnings, last28DaysEarnings, allTimeEarnings] = await Promise.all([
      calculateEarningsForPeriod(affiliateUserId, today, endOfToday),
      calculateEarningsForPeriod(affiliateUserId, sevenDaysAgo, endOfToday),
      calculateEarningsForPeriod(affiliateUserId, twentyEightDaysAgo, endOfToday),
      calculateEarningsForPeriod(affiliateUserId, new Date(''), endOfToday),
    ]);

    return {
      status: 200,
      body: {
        growSocialMediaPackageUserId: userBalance.growSocialMediaPackageUserId.toString(),
        currentBalance: userBalance.wallet,
        todayEarnings,
        last7DaysEarnings,
        last28DaysEarnings,
        allTimeEarnings,
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

    return {
      status: 200,
      body: affiliateSalesComissionResults.map((pkg) => ({
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

    const totalUsers = affiliateLeaderboardResults[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      status: 200,
      body: {
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
        totalUsers,
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
          id: affiliateUserExist._id.toString(),
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
