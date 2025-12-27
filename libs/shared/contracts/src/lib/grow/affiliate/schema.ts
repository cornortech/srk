import z from "zod";
import { commonPaginatedQueryParamsSchema, commonPaginationResponse } from "../../common";

export const getGrowAffiliateUserCommissionEarningsDashboardSchema = z.object({
    growSocialMediaPackageUserId: z.string(),
    currentBalance: z.number(),
    todayEarnings: z.number(),
    last7DaysEarnings: z.number(),
    last28DaysEarnings: z.number(),
    allTimeEarnings: z.number(),
});

export type TGetGrowAffiliateUserCommissionEarningsDashboard = z.infer<typeof getGrowAffiliateUserCommissionEarningsDashboardSchema>;

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

export const getUserAffiliateSalesComissionEarningsSchema = z.array(userAffiliateSalesComissionEarningsSchema);

export type TGetUserAffiliateSalesComissionEarnings = z.infer<typeof getUserAffiliateSalesComissionEarningsSchema>;

export const usersAffiliateComissionLeaderboardSchema = z.object({
    rank: z.number(),
    affiliateUsersStats: affiliateUsersSchema,
    salesStats: z.object({
        totalSales: z.number(),
        totalRevenue: z.number(),
    }),
});

export const getAllUsersAffiliateComissionLeaderBoardSchema = z.array(usersAffiliateComissionLeaderboardSchema);

export const paginatedGetAllUsersAffiliateComissionLeaderBoardSchema =
    commonPaginationResponse.extend({
        data: getAllUsersAffiliateComissionLeaderBoardSchema,
    });

export type TGetAllPaginatedAffiliateUsersComissionLeaderboard = z.infer<typeof paginatedGetAllUsersAffiliateComissionLeaderBoardSchema>;

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