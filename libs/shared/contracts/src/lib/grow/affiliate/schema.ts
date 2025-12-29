import z from 'zod';
import {
  commonPaginatedQueryParamsSchema,
  commonPaginationResponse,
} from '../../common';

export const getGrowAffiliateUserCommissionEarningsDashboardSchema = z.object({
  growSocialMediaPackageUserId: z.string(),
  currentBalance: z.number(),
  todayEarnings: z.object({
    totalEarnings: z.number(),
    growthPercentage: z.number().optional(),
  }),
  last7DaysEarnings: z.object({
    totalEarnings: z.number(),
    growthPercentage: z.number().optional(),
  }),
  last28DaysEarnings: z.object({
    totalEarnings: z.number(),
    growthPercentage: z.number().optional(),
  }),
  allTimeEarnings: z.number(),
  activeDaysStreak: z.number(),
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

export const getUserAffiliateSalesComissionEarningsSchema = z.object({
  totalSales: z.number(),
  totalRevenue: z.number(),
  activePackages: z.number(),
  totalCustomers: z.number(),
  users: z.array(userAffiliateSalesComissionEarningsSchema),
});

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
    timeRange: z.enum(['all', 'today', 'week']),
    data: getAllUsersAffiliateComissionLeaderBoardSchema,
  });

export type TGetAllPaginatedAffiliateUsersComissionLeaderboard = z.infer<
  typeof paginatedGetAllUsersAffiliateComissionLeaderBoardSchema
>;

export const getAllUsersAffiliateComissionLeaderBoardQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    timeRange: z.enum(['all', 'today', 'week']).optional(),
  });

export const affiliateUsersProfileSchema = z.object({
  userData: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    userType: z.string(),
    isEmailNotifications: z.boolean().optional(),
    isPushNotifications: z.boolean().optional(),
    createdAt: z.string(),
  }),
  affiliateData: z.object({
    totalAffiliates: z.number(),
    totalComissionRevenue: z.number(),
  })
});

export const getAffiliateUsersProfileSchema = affiliateUsersProfileSchema;

export type TGetAffiliateUsersProfile = z.infer<typeof getAffiliateUsersProfileSchema>
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
