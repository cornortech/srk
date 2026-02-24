import { initContract } from '@ts-rest/core';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  createBalancePayoutSchema,
  createBankPayoutRequestSchema,
  getAdminEarningDetailsSchema,
  getBalancePayoutSchema,
  getBankStatementOfSrkUniversitySchema,
  getBankStatementOfUserSchema,
  getEarningLeaderboardSchema,
  getFinanceDetailsOfUserSchema,
  getSrkBankDetailsForAdminSchema,
  getSrkBonusCashFlowForAdminSchema,
  getSrkBonusCashFlowSchema,
  getPaginatedBalancePayoutSchema,
  upsertBankDetailsSchema,
  upsertKYCDetailsSchema,
  createTaskBalancePayoutSchema,
  getTaskEarningDetailsSchema,
} from './schema';
import { z } from 'zod';
const c = initContract();

export const financeContract = c.router({
  createBalancePayout: {
    method: 'POST',
    path: '/finance/balance-payout',
    body: createBalancePayoutSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a balance payout',
  },
  srkBankPayoutRequest: {
    method: 'POST',
    path: '/finance/srkBankPayoutRequest',
    body: createBankPayoutRequestSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a balance payout',
  },
  getTaskEarningDetails: {
    method: 'GET',
    path: '/finance/task-earning/:userId',
    responses: {
      200: getTaskEarningDetailsSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get earning details of task user',
  },
  createTaskBalancePayout: {
    method: 'POST',
    path: '/finance/task-balance-payout',
    body: createTaskBalancePayoutSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a balance payout from task balance to srk bank',
  },
  getAllBalancePayoutOfUser: {
    method: 'GET',
    path: '/finance/getAllBalancePayoutsOfUser/:userId',
    responses: {
      200: getBalancePayoutSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all balance payouts',
  },
  getAllBalancePayoutsByStatus: {
    method: 'GET',
    path: '/finance/getAllBalancePayoutsByStatus',
    query: z.object({
      status: z.union([z.string(), z.array(z.string())]).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      globalSearch: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
    responses: {
      200: getPaginatedBalancePayoutSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all balance payouts',
  },
  upsertBankDetails: {
    method: 'POST',
    path: '/finance/upsertBankDetails/:userId',
    body: upsertBankDetailsSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create or update bank details',
  },
  upsertKYCDetails: {
    method: 'POST',
    path: '/finance/upsertKYCDetails/:userId',
    body: upsertKYCDetailsSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create or update bank details',
  },
  getFinanceDetailsOfUser: {
    method: 'GET',
    path: '/finance/getEarningDetailsOfUser/:userId',
    responses: {
      200: getFinanceDetailsOfUserSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get earning details of user',
  },
  getEarningLeaderboard: {
    method: 'GET',
    path: '/finance/getEarningLeaderboard',
    query: z.object({
      timeFrame: z.enum(['weekly', 'monthly', 'allTime']),
    }),
    responses: {
      200: getEarningLeaderboardSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get earning leaderboard',
  },
  approveBalancePayout: {
    method: 'POST',
    path: '/finance/approveBalancePayout/:payoutId',
    body: z.object({
      paymentProofUrl: z.string(),
      transactionNumber: z.string(),
      paymentMethod: z.string(),
    }),

    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve balance payout',
  },
  rejectBalancePayout: {
    method: 'POST',
    path: '/finance/rejectBalancePayout/:payoutId',
    body: z.object({
      reason: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject balance payout',
  },
  getAdminEarningDetails: {
    method: 'GET',
    path: '/finance/getAdminEarningDetails',
    responses: {
      200: getAdminEarningDetailsSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get admin earning details',
  },
  getBankStatementOfUser: {
    method: 'GET',
    path: '/finance/getBankStatementOfUser/:userId',
    responses: {
      200: getBankStatementOfUserSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get bank statement of user',
  },
  getBankStatementForAdmin: {
    method: 'GET',
    path: '/finance/getBankStatementForAdmin',
    responses: {
      200: getBankStatementOfUserSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get bank statement of user',
  },
  getSrkBankDetailsForAdmin: {
    method: 'GET',
    path: '/finance/getSrkBankDetailsForAdmin',
    responses: {
      200: getSrkBankDetailsForAdminSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get bank statement of user',
  },
  createSrkUniversityPayout: {
    method: 'POST',
    path: '/finance/createSrkUniversityPayout',
    body: z.object({
      type: z.enum([
        'eventWallet',
        'srkBonus',
        'tdsAmount',
        'ceoSalary',
        'officeManagementCharge',
      ]),
      amount: z.number(),
    }),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create SRK university payout',
  },
  getAllSrkUniversityBankStatement: {
    method: 'GET',
    path: '/finance/getAllSrkUniversityBankStatement',
    responses: {
      200: getBankStatementOfSrkUniversitySchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get bank statement of srk university bank',
  },
  srkBankPayoutRequestForAdmin: {
    method: 'POST',
    path: '/finance/srkUniversityBankPayout',
    body: z.object({
      amount: z.number(),
    }),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a balance payout',
  },
  approveBankDetails: {
    method: 'POST',
    path: '/finance/approveBankDetails/:userId',
    body: z.object({}).optional(),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve bank details',
  },
  getBankTable: {
    method: 'GET',
    path: '/finance/getBankRequest',
    query: z.object({
      status: z.union([z.string(), z.string().array()]).optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: z.array(
          z.object({
            profilePicture: z.string().nullable().optional(),
            username: z.string(),
            accountHolderName: z.string(),
            accountNumber: z.string(),
            ifscCode: z.string(),
            bankName: z.string(),
            branchName: z.string(),
            accountType: z.string(),
            relationWithAccount: z.string(),
            status: z.string(),
            qrUrl: z.string().optional(),
            packageTitle: z.string(),
          })
        ),
        page: z.number(),
        limit: z.number(),
        totalRequest: z.number(),
        totalPages: z.number(),
      }),
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get bank table',
  },
  rejectBankRequest: {
    method: 'POST',
    path: '/finance/rejectBankRequest/:userId',
    body: z.object({
      reason: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject bank request',
  },
  getTeamCashflowOfUser: {
    method: 'GET',
    path: '/finance/cashflow/user/:userId',
    responses: {
      200: z.array(getSrkBonusCashFlowSchema),
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get cash flow of user.',
  },
  getSrkBonusFlowForAdmin: {
    method: 'GET',
    path: '/finance/cashflow',
    responses: {
      200: z.array(getSrkBonusCashFlowForAdminSchema),
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
});
