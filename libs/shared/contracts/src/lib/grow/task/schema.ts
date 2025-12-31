import z from "zod";
import { commonPaginatedQueryParamsSchema, commonPaginationResponse } from "../../common";

export const srkTaskUserSchema = z.object({
  userData: z.object({
    _id: z.string(),
    srkUniversityUserId: z.string(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    isActivated: z.boolean(),
    kycStatus: z.enum(['pending', 'approved', 'rejected']),
    createdAt: z.string(),
  }),
  taskData: z.object({
    totalTasksCompleted: z.number(),
    totalEarnings: z.number(),
    avgDailyEarn: z.number(),
    totalCoinsEarned: z.number(),
    successRate: z.number().min(0).max(100),
  }).optional(),
});

export const getSrkTaskUserProfileSchema = srkTaskUserSchema;

export type TGetSrkTaskUserProfile = z.infer<typeof getSrkTaskUserProfileSchema>;

export const srkTaskUserAnalyticsSchema = z.object({
  coinsData: z.object({
    walletCoins: z.number(),
    today: z.number(),
    last7Days: z.number(),
    last28Days: z.number(),
    allTimeCoins: z.number(),
  }),
  tasksData: z.object({
    averageDailyCoins: z.number(),
    peakDayCoins: z.number(),
    taskCompletionRate: z.number().min(0).max(100),
  }),
});

export const getSrkTaskUserAnalyticsSchema = srkTaskUserAnalyticsSchema;

export type TGetSrkTaskUserAnalytics = z.infer<typeof getSrkTaskUserAnalyticsSchema>;

export const srkTaskUserEarningsLeaderboardSchema = z.object({
  rank: z.number(),
  fullName: z.string(),
  coins: z.number(),
  consistencyDays: z.number(),
  change: z.number(),
});

export const getAllSrkTaskUserEarningsLeaderboardSchema = z.object({
  leaderboard: z.array(srkTaskUserEarningsLeaderboardSchema),
  currentUser: srkTaskUserEarningsLeaderboardSchema.nullable(),
  timeRange: z.enum(['weekly', 'monthly', 'all']),
});

export const paginatedSrkTaskUserEarningsLeaderboardSchema =
  commonPaginationResponse.extend({
    data: getAllSrkTaskUserEarningsLeaderboardSchema,
  });

export type TPagninatedSrkTaskUserEarningsLeaderboard = z.infer<typeof paginatedSrkTaskUserEarningsLeaderboardSchema>;

export const getSrkTaskUserEarningsLeaderboardQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    timeRange: z.enum(['weekly', 'monthly', 'all']).optional(),
    search: z.string().optional(),
    currentUserId: z.string().optional(),
  });

  export const acceptSrkTaskUserEarningsPayoutSchema = z.object({
    transactionId: z.string(),
    paymentScreenshotUrl: z.string().url(),
  });

  export type TACeeptSrkTaskUSserEarningsPayout = z.infer<typeof acceptSrkTaskUserEarningsPayoutSchema>;

  export const rejectSrkTaskUserEarningsPayoutSchema = z.object({
    rejectionReason: z.string(),
  });

  export type TRejectSrkTaskUserEarningsPayout = z.infer<typeof rejectSrkTaskUserEarningsPayoutSchema>;