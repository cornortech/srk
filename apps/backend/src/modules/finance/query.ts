import {
  AppRouteImplementation,
  AppRouteImplementationOrOptions,
} from '@ts-rest/express/src/lib/types';
import mongoose from 'mongoose';
import { balancePayoutModel } from '../../model/balancePayoutModel';
import { financeContract } from '../../../../../libs/shared/contracts/src/lib/finance/contract';
import { balanceModel } from '../../model/balanceModel';
import { adminBalanceModel } from '../../model/adminBalanceModel';
import bankStatement from '../../model/bankStatement';
import { SrkBankModel } from '../../model/srkBankModel';
import { AdminSrkBankModel } from '../../model/AdminSrkBankModel';
import { UserModel } from '../../model/userModel';
import { BankModel } from '../../model/bankModel';
import { SrkUniversityBankModel } from '../../model/srkUniversityBankModel';
import { TGetSrkBonusCashFlow } from '../../../../../libs/shared/contracts/src/lib/finance/schema';
import { Types } from 'mongoose';
import { EarningStatementModel } from '../../model/earningStatementModel';

const getAllBalancePayoutOfUser: AppRouteImplementationOrOptions<
  typeof financeContract.getAllBalancePayoutOfUser
> = async ({ params }) => {
  try {
    const balancePayouts = await balancePayoutModel
      .find({
        userId: params.userId,
      })
      .sort({ createdAt: -1 })
      .populate<{
        userId: {
          _id: string;
          email: string;
          firstName: string;
          lastName: string;
          profilePicture: string;
          packageId: {
            _id: string;
            title: string;
          };
        };
      }>({
        path: 'userId',
        populate: {
          path: 'packageId',
          select: 'title',
        },
      });

    return {
      status: 200,
      body: await Promise.all(
        balancePayouts.map(async (p) => {
          const bankExist = await BankModel.findOne({
            userId: p.userId._id,
          });
          return {
            _id: p._id.toString(),
            amount: p.amount,
            username: `${p.userId.firstName} ${p.userId.lastName}`,
            status: p.status,
            userId: p.userId._id.toString(),
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            tdsAmount: p.tdsAmount,
            totalAmount: p.totalAmount,
            transactionNumber: p.transactionNumber || '-',
            paymentMethod: p.paymentMethod || '',
            paymentProofUrl: p.paymentProofUrl || '',
            qrUrl: bankExist?.qrUrl || '',
            packageTitle: p.userId?.packageId?.title || '',
          };
        })
      ),
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

const calculateEarnings = async (userId: string, days: number) => {
  const startDate = new Date();

  if (days === 1) {
    // Set startDate to last midnight (00:00:00)
    startDate.setHours(0, 0, 0, 0);
  } else {
    // Calculate based on days
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
  }

  const earnings = await EarningStatementModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$balanceWallet' },
      },
    },
  ]);

  return earnings.length > 0 ? earnings[0].totalEarnings : 0;
};

const getFinanceDetailsOfUser: AppRouteImplementationOrOptions<
  typeof financeContract.getFinanceDetailsOfUser
> = async ({ req, params }) => {
  try {
    const { userId } = req.params;

    // Fetch balance details
    const userBalance = await balanceModel.findOne({ userId });

    // use aggregate method
    const bankPayouts = await balancePayoutModel.find({
      userId: userId,
      status: 'pending',
    });

    if (!userBalance) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'User balance not found',
        },
      };
    }
    const srkBankAmount = await SrkBankModel.findOne({
      userId: req.params.userId,
    });
    // Calculate earnings
    const todayEarnings = await calculateEarnings(userId, 1);
    const last7DaysEarnings = await calculateEarnings(userId, 7);
    const last30DaysEarnings = await calculateEarnings(userId, 30);
    const allTimeEarnings = userBalance.totalEarnings;
    const totalBankPayout = bankPayouts.reduce(
      (total, payout) => total + payout.amount,
      0
    );

    return {
      status: 200,
      body: {
        eventWallet: userBalance.eventWallet,
        srkBonus: userBalance.srkBonus,
        walletBalance: userBalance.balance,
        totalTds: userBalance.totalTds,
        totalWithdraw: userBalance.totalWithdraw,
        srkBankAmount: srkBankAmount?.amount || 0,
        tourBalance: userBalance.tourBalance || 0,
        totalBankPayout,
        todayEarnings,
        last7DaysEarnings,
        last30DaysEarnings,
        allTimeEarnings,
      },
    };
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getLeaderboard = async (timeframe: 'weekly' | 'monthly' | 'allTime') => {
  let startDate = new Date();

  switch (timeframe) {
    case 'weekly':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'allTime':
      startDate = new Date(0); // Earliest date possible
      break;
    default:
      throw new Error('Invalid timeframe');
  }

  const leaderboard = await EarningStatementModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$userId',
        totalEarnings: { $sum: '$earning' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        username: '$user.firstName',
        lastName: '$user.lastName',
        profilePicture: '$user.profilePicture',
        country: '$user.country',
        totalEarnings: 1,
      },
    },
    {
      $sort: { totalEarnings: -1 }, // Sort by highest earnings
    },
    {
      $limit: 10, // Top 10 users
    },
  ]);

  return leaderboard;
};
const getEarningLeaderboard: AppRouteImplementationOrOptions<
  typeof financeContract.getEarningLeaderboard
> = async ({ req }) => {
  try {
    const { timeFrame } = req.query;

    if (!['weekly', 'monthly', 'allTime'].includes(timeFrame)) {
      return {
        status: 400,
        body: {
          success: false,
          message: 'Invalid time frame',
        },
      };
    }

    const leaderboard = await getLeaderboard(timeFrame);

    return {
      status: 200,
      body: leaderboard.map((user, index) => ({
        userId: user.userId,
        username: `${user.username} ${user.lastName}`,
        totalEarnings: user.totalEarnings,
        country: user.country,
        profilePicture: user.profilePicture,
        position: index + 1,
      })),
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getAllBalancePayoutsByStatus: AppRouteImplementationOrOptions<
  typeof financeContract.getAllBalancePayoutsByStatus
> = async ({ req }) => {
  try {
    const { status, startDate, endDate, globalSearch } = req.query as {
      status?: string | string[];
      startDate?: string;
      endDate?: string;
      globalSearch?: string;
      page?: string;
      limit?: string;
    };

    // Convert status to array
    const statusArray = status
      ? Array.isArray(status)
        ? status
        : [status]
      : [];

    // Pagination
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};

    // Status filter
    if (statusArray.length > 0) {
      query.status = { $in: statusArray };
    }

    // Date filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Global search
    if (globalSearch) {
      query.$or = [
        { payoutId: { $regex: globalSearch, $options: 'i' } },
        { status: { $regex: globalSearch, $options: 'i' } },
        { transactionNumber: { $regex: globalSearch, $options: 'i' } },
      ];
    }

    // Count total
    const totalRequest = await balancePayoutModel.countDocuments(query);

    // Fetch paginated data
    const payouts = await balancePayoutModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        userId: {
          _id: string;
          email: string;
          firstName: string;
          lastName: string;
          profilePicture: string;
          packageId: {
            _id: string;
            title: string;
          };
        };
      }>({
        path: 'userId',
        populate: {
          path: 'packageId',
          select: 'title',
        },
      });

    // Format records
    const formatted = await Promise.all(
      payouts.map(async (p) => {
        const username = p.isAdmin
          ? 'Admin'
          : `${p.userId.firstName} ${p.userId.lastName}`;

        const bankExist = await BankModel.findOne({
          userId: p.userId,
        });

        return {
          _id: p._id.toString(),
          paymentProofUrl: p.paymentProofUrl || '',
          username,
          userId: p.userId?._id,
          amount: p.amount,
          status: p.status,
          tdsAmount: p.tdsAmount,
          totalAmount: p.totalAmount,
          transactionNumber: p.transactionNumber || '-',
          qrUrl: bankExist?.qrUrl || '',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          paymentMethod: p.paymentMethod || '',
          packageTitle: p.userId?.packageId?.title || '',
        };
      })
    );

    // Return consistent paginated response
    return {
      status: 200,
      body: {
        data: formatted,
        limit,
        page,
        totalRequest,
        totalPages: Math.ceil(totalRequest / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching balance payouts:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getAdminEarningDetails: AppRouteImplementationOrOptions<
  typeof financeContract.getAdminEarningDetails
> = async ({ req }) => {
  try {
    const adminEarningDetails = await adminBalanceModel.findOne();

    if (!adminEarningDetails) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Admin balance not found',
        },
      };
    }

    const pendingDistributionResult = await balancePayoutModel.aggregate([
      {
        $match: {
          status: 'pending',
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const pendingDistribution =
      pendingDistributionResult.length > 0
        ? pendingDistributionResult[0].totalAmount
        : 0;

    const totalTurnoverResult = await EarningStatementModel.aggregate([
      {
        $group: {
          _id: null,
          totalTurnover: { $sum: '$companyTurnover' },
        },
      },
    ]);

    const srkBankAmount = await SrkBankModel.findOne({
      userId: req.params.userId,
    });

    const totalTurnover =
      totalTurnoverResult.length > 0 ? totalTurnoverResult[0].totalTurnover : 0;

    const srkUniversityBankExist = await SrkUniversityBankModel.findOne({});

    return {
      status: 200,
      body: {
        eventWallet: +adminEarningDetails.eventWallet?.toFixed(2),
        ceoSalary: +adminEarningDetails.ceoSalary?.toFixed(2),
        companyTurnover: +adminEarningDetails.companyTurnover?.toFixed,
        companyWallet: +adminEarningDetails.companyWallet?.toFixed(2),
        officeManagementCharge:
          +adminEarningDetails.officeManagementCharge?.toFixed(2),
        tdsAmount: +adminEarningDetails.tdsAmount?.toFixed(2),
        srkBankAmount: +(srkBankAmount?.amount || 0).toFixed(2),
        pendingDistribution: +pendingDistribution.toFixed(2),
        totalTurnover: totalTurnover,
        srkUniversityAmount:
          +(srkUniversityBankExist?.amount?.toFixed(2) || 0) || null,
        srkUniversityPendingAmount:
          +(srkUniversityBankExist?.totalPendingPayout?.toFixed(2) || 0) ||
          null,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};
const getBankStatementOfUser: AppRouteImplementation<
  typeof financeContract.getBankStatementOfUser
> = async ({ req }) => {
  try {
    const srkBankExist = await SrkBankModel.findOne({
      userId: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    if (!srkBankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Bank details not found',
        },
      };
    }

    const bankStatements = await bankStatement
      .find({
        bankId: srkBankExist._id,
        type: {
          $in: ['deposit', 'payout_request', 'refunded'],
        },
      })
      .sort({
        createdAt: -1,
      });

    return {
      status: 200,
      body: await Promise.all(
        bankStatements.map(async (statement) => {
          const srkBankModel = await SrkBankModel.findById(statement.bankId);

          const userExist = await UserModel.findById(srkBankModel?.userId);
          return {
            _id: statement._id.toString(),
            username: `${userExist?.firstName} ${userExist?.lastName}`,
            profilePicture: userExist?.profilePicture || '',
            amount: statement.amount,
            bankId: statement.bankId?.toString() || '',
            description: statement.description || '',
            currentAmount: statement.currentAmount,
            type: statement.type,
            createdAt: statement.createdAt,
            updatedAt: statement.updatedAt,
          };
        })
      ),
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getBankStatementForAdmin: AppRouteImplementation<
  typeof financeContract.getBankStatementForAdmin
> = async ({ req }) => {
  try {
    const bankStatements = await bankStatement
      .find({
        type: {
          $in: ['deposit', 'payout_request', 'payout', 'refunded'],
        },
      })
      .sort({
        createdAt: -1,
      });

    return {
      status: 200,
      body: await Promise.all(
        bankStatements.map(async (statement) => {
          const srkBankModel = await SrkBankModel.findById(statement.bankId);

          const userExist = await UserModel.findById(srkBankModel?.userId);

          return {
            _id: statement._id.toString(),
            username: `${userExist?.firstName} ${userExist?.lastName}`,
            profilePicture: userExist?.profilePicture || '',
            amount: statement.amount,
            bankId: statement.bankId?.toString() || '',
            description: statement.description || '',
            currentAmount: statement.currentAmount,
            type: statement.type,
            createdAt: statement.createdAt,
            updatedAt: statement.updatedAt,
          };
        })
      ),
    };
  } catch (error) {
    console.error('Error fetching bank statement:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

const getSrkBankDetailsForAdmin: AppRouteImplementation<
  typeof financeContract.getSrkBankDetailsForAdmin
> = async ({ req }) => {
  try {
    const srkBankExist = await AdminSrkBankModel.findOne({});
    if (!srkBankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Srk Bank details not found',
        },
      };
    }
    return {
      status: 200,
      body: {
        totalPendingPayout: srkBankExist.totalPendingPayout,
        amount: srkBankExist.amount,
      },
    };
  } catch (error) {
    console.error('Error fetching balance details:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};
const getAllSrkUniversityBankStatement: AppRouteImplementationOrOptions<
  typeof financeContract.getAllSrkUniversityBankStatement
> = async ({ req }) => {
  try {
    const srkUniversityBankExist = await SrkUniversityBankModel.findOne({});

    if (!srkUniversityBankExist) {
      return {
        status: 404,
        body: {
          success: false,
          message: 'Srk university bank not found',
        },
      };
    }

    const bankStatements = await bankStatement
      .find({
        srkUniversityBankId: srkUniversityBankExist._id,
      })
      .sort({
        createdAt: -1,
      });

    return {
      status: 200,
      body: await Promise.all(
        bankStatements.map(async (statement) => {
          return {
            _id: statement._id.toString(),
            amount: statement.amount,
            bankId: statement.bankId?.toString() || '',
            description: statement.description || '',
            currentAmount: statement.currentAmount,
            type: statement.type,
            createdAt: statement.createdAt,
            updatedAt: statement.updatedAt,
          };
        })
      ),
    };
  } catch (error) {
    console.error('Error fetching balance details:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};
const getBankTable: AppRouteImplementationOrOptions<
  typeof financeContract.getBankTable
> = async ({ req }) => {
  try {
    const { status } = req.query as { status?: string | string[] };

    const statusArray: string[] = status
      ? Array.isArray(status)
        ? status
        : [status]
      : [];

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const skip = (page - 1) * limit;

    const queryReq: Record<string, any> = {};

    if (statusArray.length > 0) {
      queryReq.status = { $in: statusArray };
    }

    const totalRequest = await BankModel.countDocuments(queryReq);

    const bankTable = await BankModel.find(queryReq)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{
        userId: {
          _id: string;
          firstName: string;
          lastName: string;
          profilePicture: string;
          packageId: {
            _id: string;
            title: string;
          };
        };
      }>({
        path: 'userId',
        populate: {
          path: 'packageId',
          select: 'title',
        },
      });

    // Format response
    const formattedBankTable = bankTable.map((bank) => ({
      username: `${bank.userId.firstName} ${bank.userId.lastName}`,
      profilePicture: bank.userId.profilePicture,
      _id: bank._id.toString(),
      userId: bank.userId._id.toString(),
      bankName: bank.bankName,
      accountHolderName: bank.accountHolderName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode || '',
      accountType: bank.accountType,
      branchName: bank.branchName,
      relationWithAccount: bank.relationWithAccount,
      status: bank.status,
      qrUrl: bank.qrUrl || '',
      packageTitle: bank.userId.packageId?.title || '',
    }));

    return {
      status: 200,
      body: {
        data: formattedBankTable,
        limit,
        page,
        totalRequest,
        totalPages: Math.ceil(totalRequest / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching bank table:', error);
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

interface PopulatedTransaction {
  _id: Types.ObjectId;
  srkBonus?: number;
  createdAt?: Date;

  referredTo: {
    firstName: string;
    lastName: string;
    purpose: string;
    packageId: {
      title: string;
    };
  };

  userId: {
    firstName: string;
    lastName: string;
  };
}

const getTeamCashflowOfUser: AppRouteImplementation<
  typeof financeContract.getTeamCashflowOfUser
> = async ({ req }) => {
  try {
    // Step 1: Find users referred by the given userId
    const myReferrals = await UserModel.find({
      referredBy: req.params.userId,
    }).lean();

    const referralIds = myReferrals.map((ref) => ref._id);

    // Step 2: Fetch transactions for those referrals
    const allTransactions = (await EarningStatementModel.find({
      userId: { $in: referralIds },
      type: 'REFERRAL_EANRING',
    })
      .populate({
        path: 'referredTo',
        select: 'firstName lastName purpose packageId',
        populate: {
          path: 'packageId',
          select: 'title',
        },
      })
      .populate({
        path: 'userId',
        select: 'firstName lastName',
      })
      .sort({ createdAt: -1 })
      .lean()) as unknown as PopulatedTransaction[];

    // Step 3: Map to response format
    const response: TGetSrkBonusCashFlow[] = allTransactions.map((r) => ({
      _id: r._id.toString(),
      package: r.referredTo?.packageId?.title ?? 'N/A',
      purpose: r.referredTo?.purpose ?? 'N/A',
      username: `${r.userId?.firstName ?? ''} ${
        r.userId?.lastName ?? ''
      }`.trim(),
      registeredUser: `${r.referredTo?.firstName ?? ''} ${
        r.referredTo?.lastName ?? ''
      }`.trim(),
      bonusAmount: r.srkBonus ?? 0,
      createdAt: r.createdAt ?? new Date(),
    }));

    return {
      status: 200,
      body: response,
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

const getSrkBonusFlowForAdmin: AppRouteImplementation<
  typeof financeContract.getSrkBonusFlowForAdmin
> = async ({ req }) => {
  try {
    // 1. Fetch balances where srkBonus > 0
    const balancesWithSrkBonus = await balanceModel
      .find({ srkBonus: { $gt: 0 } })
      .populate({
        path: 'userId',
        select: 'firstName lastName email createdAt purpose',
      })
      .lean();

    const response = await Promise.all(
      balancesWithSrkBonus.map(async (balance) => {
        const user = balance.userId as any;

        // Step 1: Find users referred by this user
        const myReferrals = await UserModel.find({
          referredBy: user._id,
        }).lean();

        const referralIds = myReferrals.map((ref) => ref._id);

        // Step 2: Fetch referral earnings transactions
        const allTransactions = (await EarningStatementModel.find({
          userId: { $in: referralIds },
          type: 'REFERRAL_EANRING',
        })
          .populate({
            path: 'referredTo',
            select: 'firstName lastName purpose packageId',
            populate: {
              path: 'packageId',
              select: 'title',
            },
          })
          .populate({
            path: 'userId',
            select: 'firstName lastName',
          })
          .sort({ createdAt: -1 })
          .lean()) as unknown as PopulatedTransaction[];

        const totalSrkBonus = allTransactions.reduce((acc, curr) => {
          return acc + (curr.srkBonus || 0);
        }, 0);

        return {
          _id: user._id,
          noOfSrkBonus: totalSrkBonus,
          totalSrkBonus: allTransactions.length,
          email: user.email,
          purpose: user.purpose,
          registeredAt: user.createdAt,
          storeName: `${user.firstName} ${user.lastName}`,
        };
      })
    );

    return {
      status: 200,
      body: response.map((r) => ({
        _id: r._id.toString(),
        email: r.email,
        purpose: r.purpose || '',
        storeName: r.storeName,
        registeredAt: r.registeredAt,
        noOfSrkBonus: r.noOfSrkBonus,
        totalSrkBonus: r.totalSrkBonus,
      })),
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        message: 'Internal server error',
      },
    };
  }
};

export const financeQueryHandler = {
  getBankTable,
  getAllSrkUniversityBankStatement,
  getSrkBankDetailsForAdmin,
  getBankStatementForAdmin,
  getBankStatementOfUser,
  getAdminEarningDetails,
  getEarningLeaderboard,
  getFinanceDetailsOfUser,
  getAllBalancePayoutOfUser,
  getAllBalancePayoutsByStatus,
  getTeamCashflowOfUser,
  getSrkBonusFlowForAdmin,
};
