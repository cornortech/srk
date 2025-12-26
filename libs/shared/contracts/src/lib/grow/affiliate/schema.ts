import z from 'zod';
import {
  commonPaginatedQueryParamsSchema,
  commonPaginationResponse,
} from '../../common';

export const getGrowAffiliateUserCommissionEarningsDashboardSchema = z.object({
  growSocialMediaPackageUserId: z.string(),
  currentBalance: z.number(),
  todayEarnings: z.number(),
  last7DaysEarnings: z.number(),
  last28DaysEarnings: z.number(),
  allTimeEarnings: z.number(),
});

export type TGetGrowAffiliateUserCommissionEarningsDashboard = z.infer<
  typeof getGrowAffiliateUserCommissionEarningsDashboardSchema
>;

export const affiliateUsersSchema = z.object({
  affiliateUserId: z.string(),
  name: z.string(),
});

export const userAffiliateSalesComissionEarningsSchema = z.object({
  name: z.string(),
  price: z.number(),
  affiliateSales: z.object({
    earnings: z.number(),
    totalPackageSales: z.number(),
  }),
  affiliateUsers: z.array(affiliateUsersSchema),
});

export const getUserAffiliateSalesComissionEarningsSchema = z.array(
  userAffiliateSalesComissionEarningsSchema
);

export type TGetUserAffiliateSalesComissionEarnings = z.infer<
  typeof getUserAffiliateSalesComissionEarningsSchema
>;

export const usersAffiliateComissionLeaderboardSchema = z.object({
  rank: z.number(),
  affiliateUsersStats: affiliateUsersSchema,
  salesStats: z.object({
    totalSales: z.number(),
    totalRevenue: z.number(),
  }),
});

export const getAllUsersAffiliateComissionLeaderBoardSchema = z.array(
  usersAffiliateComissionLeaderboardSchema
);

export const paginatedGetAllUsersAffiliateComissionLeaderBoardSchema =
  commonPaginationResponse.extend({
    data: getAllUsersAffiliateComissionLeaderBoardSchema,
  });

export type TGetAllPaginatedAffiliateUsersComissionLeaderboard = z.infer<
  typeof paginatedGetAllUsersAffiliateComissionLeaderBoardSchema
>;

export const getAllUsersAffiliateComissionLeaderBoardQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    timeRange: z.enum(['all', 'today', 'week']).optional(),
  });

export const createSrkAffiliateEarningPayoutBodySchema = z.object({
  growSocialMediaPackageUserId: z.string(),
  amount: z.number(),
});

export type TCreateSrkAffiliateEarningPayoutBody = z.infer<
  typeof createSrkAffiliateEarningPayoutBodySchema
>;

export const rejectSrkAffiliateEarningPayoutBodySchema = z.object({
  payoutId: z.string(),
  rejectionReason: z.string(),
});

export type TRejectSrkAffiliateEarningPayoutBody = z.infer<
  typeof rejectSrkAffiliateEarningPayoutBodySchema
>;

export const acceptSrkAffiliateEarningPayoutBodySchema = z.object({
  transactionId: z.string(),
  paymentScreenshot: z.string(),
});

export type TAcceptSrkAffiliateEarningPayoutBody = z.infer<
  typeof acceptSrkAffiliateEarningPayoutBodySchema
>;

export const getSrkAffiliateEarningPayoutSchema = z.object({
  user: z.object({
    userId: z.string(),
    username: z.string(),
    email: z.string(),
  }),
  payoutId: z.string(),
  transactionId: z.string().optional(),
  amount: z.number(),
  status: z.enum(['requested', 'approved', 'rejected']),
  rejectionReason: z.string().optional(),
  paymentScreenshot: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetSrkAffiliateEarningPayoutForAdmin = z.infer<
  typeof getPaginatedGetSrkAffiliateEarningPayoutForAdminSchema
>;

export const getPaginatedGetSrkAffiliateEarningPayoutForAdminSchema =
  commonPaginationResponse.extend({
    data: z.array(getSrkAffiliateEarningPayoutSchema),
  });

export type TGetPaginatedSrkAffiliateEarningPayoutForAdmin = z.infer<
  typeof getPaginatedGetSrkAffiliateEarningPayoutForAdminSchema
>;

export const getSrkAffiliateEarningPayoutForAdminQueryParamsSchema =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['requested', 'approved', 'rejected']).optional(),
  });

export type TGetSrkAffiliateEarningPayoutForAdminQueryParams = z.infer<
  typeof getSrkAffiliateEarningPayoutForAdminQueryParamsSchema
>;
