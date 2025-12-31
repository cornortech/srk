import z from 'zod';
import {
  commonPaginatedQueryParamsSchema,
  commonPaginationResponse,
} from '../../common';

// Action Submission details for admin
export const srkTaskActionSubmissionDetailsSchema = z.object({
  _id: z.string(),
  taskUserId: z.string(),
  growEnrollmentId: z
    .object({
      _id: z.string(),
      socialMediaPlatform: z.string(),
      profileLinkURL: z.array(z.string()),
      amount: z.number(),
      isActive: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
      growSocialMediaPackageId: z.object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
        socialMediaPlatforms: z.array(z.string()),
        amount: z.number(),
      }),
      growSocialMediaPackageTypeId: z.object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
        amount: z.number(),
      }),
      growSocialMediaPackageSubTypeId: z.object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
        taskType: z.string(),
        noOfLikes: z.number().optional(),
        noOfVideos: z.number().optional(),
        noOfFollowers: z.number().optional(),
      }),
    })
    .optional(),
  screenshotUrl: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedSrkTaskActionSubmissionsByStatusForAdminSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskActionSubmissionDetailsSchema),
  });

export type TPaginatedSrkTaskActionSubmissionsByStatusForAdmin = z.infer<
  typeof paginatedSrkTaskActionSubmissionsByStatusForAdminSchema
>;

export const getSrkTaskActionSubmissionsByStatusForAdminQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  });
export type TGetSrkTaskActionSubmissionsByStatusForAdminQueryParams = z.infer<
  typeof getSrkTaskActionSubmissionsByStatusForAdminQueryParams
>;

export const getSrkTaskActionSubmissionsByStatusForUserQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  });
export type TGetSrkTaskActionSubmissionsByStatusForUserQueryParams = z.infer<
  typeof getSrkTaskActionSubmissionsByStatusForUserQueryParams
>;

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
  taskData: z
    .object({
      totalTasksCompleted: z.number(),
      totalEarnings: z.number(),
      avgDailyEarn: z.number(),
      totalCoinsEarned: z.number(),
      successRate: z.number().min(0).max(100),
    })
    .optional(),
});

export const getSrkTaskUserProfileSchema = srkTaskUserSchema;

export type TGetSrkTaskUserProfile = z.infer<
  typeof getSrkTaskUserProfileSchema
>;

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

export type TGetSrkTaskUserAnalytics = z.infer<
  typeof getSrkTaskUserAnalyticsSchema
>;

export const srkTaskUserEarningsLeaderboardSchema = z.object({
  rank: z.number(),
  fullName: z.string(),
  coins: z.number(),
  consistencyDays: z.number(),
  change: z.number(),
});

export const getAllSrkTaskUserEarningsLeaderboardSchema = z.object({
  leaderboard: z.array(srkTaskUserEarningsLeaderboardSchema),
  currentUser: srkTaskUserEarningsLeaderboardSchema,
  timeRange: z.enum(['weekly', 'monthly', 'all']),
});

export const paginatedSrkTaskUserEarningsLeaderboardSchema =
  commonPaginationResponse.extend({
    data: getAllSrkTaskUserEarningsLeaderboardSchema,
  });

export type TPagninatedSrkTaskUserEarningsLeaderboard = z.infer<
  typeof paginatedSrkTaskUserEarningsLeaderboardSchema
>;

export const getSrkTaskUserEarningsLeaderboardQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    timeRange: z.enum(['weekly', 'monthly', 'all']).optional(),
    search: z.string().optional(),
  });

export const acceptSrkTaskUserEarningsPayoutSchema = z.object({
  transactionId: z.string(),
  paymentScreenshotUrl: z.string().url(),
});

export type TACeeptSrkTaskUSserEarningsPayout = z.infer<
  typeof acceptSrkTaskUserEarningsPayoutSchema
>;

export const rejectSrkTaskUserEarningsPayoutSchema = z.object({
  rejectionReason: z.string(),
});

export type TRejectSrkTaskUserEarningsPayout = z.infer<
  typeof rejectSrkTaskUserEarningsPayoutSchema
>;

export const submitTaskOnboardingVerificationSchema = z.object({
  documentUrl: z.string().url(),
  signatureUrl: z.string().url(),
  verificationImageUrl: z.string().url(),
  fullName: z.string(),
  dateOfBirth: z.string(),
});

export type TSubmitTaskOnboardingVerification = z.infer<
  typeof submitTaskOnboardingVerificationSchema
>;

export const srkTaskActionSubmissionBodySchema = z.object({
  srkGrowEnrollmentId: z.string(),
  srkTaskUserId: z.string(),
  actionVerificationImageUrl: z.string().url(),
});
export type TSrkTaskActionSubmissionBody = z.infer<
  typeof srkTaskActionSubmissionBodySchema
>;

export const growSocialMediaPackageEnrollmentDetailsSchema = z.object({
  _id: z.string(),
  growSocialMediaPackageUserId: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    country: z.string(),
    status: z.string(),
  }),
  growSocialMediaPackageId: z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    socialMediaPlatforms: z.array(z.string()),
    amount: z.number(),
  }),
  growSocialMediaPackageTypeId: z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    amount: z.number(),
  }),
  growSocialMediaPackageSubTypeId: z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    taskType: z.string(),
    noOfLikes: z.number().optional(),
    noOfVideos: z.number().optional(),
    noOfFollowers: z.number().optional(),
  }),
  socialMediaPlatform: z.string(),
  profileLinkURL: z.array(z.string()),
  amount: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const srkTaskEarningRequestResponseSchema = z.object({
  _id: z.string(),
  taskUserId: z.string(),
  taskDetails: growSocialMediaPackageEnrollmentDetailsSchema.optional(),
  transactionId: z.string().nullable(),
  coinsUsed: z.number(),
  tds: z.number(),
  amount: z.number(),
  status: z.enum(['pending', 'approved', 'rejected']),
  paymentScreenshotUrl: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedSrkTaskEarningRequestsByUserSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskEarningRequestResponseSchema),
  });

export type TPaginatedSrkTaskEarningRequestsByUser = z.infer<
  typeof paginatedSrkTaskEarningRequestsByUserSchema
>;

export const paginatedSrkTaskEarningRequestsByAdminSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskEarningRequestResponseSchema),
  });

export type TPaginatedSrkTaskEarningRequestsByAdmin = z.infer<
  typeof paginatedSrkTaskEarningRequestsByAdminSchema
>;

export const getSrkTaskEarningRequestsByAdminQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  });
export type TGetSrkTaskEarningRequestsByAdminQueryParams = z.infer<
  typeof getSrkTaskEarningRequestsByAdminQueryParams
>;

export const getSrkTaskActionsByPlatformResponseSchema = z.object({
  enrollmentId: z.string(),
  socialMediaPlatform: z.string(),
  username: z.string(),
  profileLinkURL: z.string().nullable(),
  taskType: z.enum(['follow', 'like']),
  postUrl: z.string().nullable(),
});

export const paginatedSrkTaskActionsByPlatformResponseSchema =
  commonPaginationResponse.extend({
    data: z.array(getSrkTaskActionsByPlatformResponseSchema),
  });

export type TPaginatedSrkTaskActionsByPlatformResponse = z.infer<
  typeof paginatedSrkTaskActionsByPlatformResponseSchema
>;

export const getSrkTaskActionsByPlatformsQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    platform: z.enum(['instagram', 'twitter', 'facebook', 'linkedin']),
    type: z.enum(['follow', 'like']).optional(),
  });

export type TGetSrkTaskActionsByPlatformsQueryParams = z.infer<
  typeof getSrkTaskActionsByPlatformsQueryParams
>;
