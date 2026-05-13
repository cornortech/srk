import z from 'zod';
import {
  commonPaginatedQueryParamsSchema,
  commonPaginationResponse,
} from '../../common';
import { Types } from 'mongoose';

// Action Submission details for admin
export const srkTaskActionSubmissionDetailsSchema = z.object({
  _id: z.string(),
  type: z.enum(['follow', 'like']),
  description: z.string(),
  hasClaimedEarning: z.boolean(),
  taskUserId: z
    .object({
      _id: z.string(),
      fullName: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
    })
    .optional(),
  growPackageTodoId: z
    .object({
      _id: z.string(),
      postUrl: z.string(),
      profileUrl: z.string(),
      type: z.enum(['follow', 'like']),
      platform: z.string(),
      followCounts: z.number(),
      likeCounts: z.number(),
      enrollment: z
        .object({
          _id: z.string(),
          socialMediaPlatform: z.string(),
          profileLinkURL: z.array(z.string()),
          amount: z.number(),
          isActive: z.boolean(),
          growSocialMediaPackageId: z
            .object({
              _id: z.string(),
              name: z.string(),
              description: z.string(),
              socialMediaPlatforms: z.array(z.string()),
              amount: z.number(),
            })
            .optional(),
          growSocialMediaPackageTypeId: z
            .object({
              _id: z.string(),
              name: z.string(),
              description: z.string(),
              amount: z.number(),
            })
            .optional(),
          growSocialMediaPackageSubTypeId: z
            .object({
              _id: z.string(),
              name: z.string(),
              description: z.string(),
              taskType: z.string(),
              noOfLikes: z.number().optional(),
              noOfVideos: z.number().optional(),
              noOfFollowers: z.number().optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),
  screenshotUrl: z.string(),
  status: z.enum(['pending', 'approved', 'rejected', 'claimed']),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedSrkTaskActionSubmissionsByStatusForAdminSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskActionSubmissionDetailsSchema),
    totalSubmissionsCount: z.number().optional(),
  });

export type TPaginatedSrkTaskActionSubmissionsByStatusForAdmin = z.infer<
  typeof paginatedSrkTaskActionSubmissionsByStatusForAdminSchema
>;

export const getSrkTaskActionSubmissionsByStatusForAdminQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected', 'claimed']).optional(),
  });
export type TGetSrkTaskActionSubmissionsByStatusForAdminQueryParams = z.infer<
  typeof getSrkTaskActionSubmissionsByStatusForAdminQueryParams
>;

export const getSrkTaskActionSubmissionsByStatusForUserQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected', 'claimed']).optional(),
  });
export type TGetSrkTaskActionSubmissionsByStatusForUserQueryParams = z.infer<
  typeof getSrkTaskActionSubmissionsByStatusForUserQueryParams
>;

export const paginatedSrkTaskActionSubmissionsByUserSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskActionSubmissionDetailsSchema),
  });

export type TPaginatedSrkTaskActionSubmissionsByUser = z.infer<
  typeof paginatedSrkTaskActionSubmissionsByUserSchema
>;

export const getSrkTaskActionSubmissionByStatusByUserQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected', 'claimed']).optional(),
  });

export type TGetSrkTaskActionSubmissionByStatusByUserQueryParams = z.infer<
  typeof getSrkTaskActionSubmissionByStatusByUserQueryParams
>;

// Rejected Task Submissions for User (Attention Needed)
export const getRejectedSrkTaskActionSubmissionsByUserQueryParams =
  commonPaginatedQueryParamsSchema;

export type TGetRejectedSrkTaskActionSubmissionsByUserQueryParams = z.infer<
  typeof getRejectedSrkTaskActionSubmissionsByUserQueryParams
>;

export const paginatedRejectedSrkTaskActionSubmissionsByUserSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskActionSubmissionDetailsSchema),
  });

export type TPaginatedRejectedSrkTaskActionSubmissionsByUser = z.infer<
  typeof paginatedRejectedSrkTaskActionSubmissionsByUserSchema
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
    todayChange: z.number(),
    last7Days: z.number(),
    last7DaysChange: z.number(),
    last28Days: z.number(),
    last28DaysChange: z.number(),
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
  userId: z.string(),
  fullName: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  isActivated: z.boolean(),
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

export type TPagninatedSrkTaskUserEarningsLeaderboard = z.infer<
  typeof paginatedSrkTaskUserEarningsLeaderboardSchema
>;

export const getSrkTaskUserEarningsLeaderboardQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    timeRange: z.enum(['weekly', 'monthly', 'all']).optional(),
    search: z.string().optional(),
    currentUserId: z.string().optional(),
  });

// All Users for Admin
export const srkTaskUserForAdminSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  dob: z.string(),
  isActivated: z.boolean(),
  kycStatus: z.enum(['pending', 'approved', 'rejected']).nullable(),
  totalCoins: z.number(),
  totalTasks: z.number(),
  completedTasks: z.number(),
  successRate: z.number(),
  joinedAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedSrkTaskUsersForAdminSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskUserForAdminSchema),
  });

export type TPaginatedSrkTaskUsersForAdmin = z.infer<
  typeof paginatedSrkTaskUsersForAdminSchema
>;

export const getAllSrkTaskUsersForAdminQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    search: z.string().optional(),
    isActivated: z.string().optional(), // 'true' or 'false'
  });

export type TGetAllSrkTaskUsersForAdminQueryParams = z.infer<
  typeof getAllSrkTaskUsersForAdminQueryParams
>;

// Completed Task Submissions for Admin
export const completedSrkTaskSubmissionSchema = z.object({
  _id: z.string(),
  type: z.enum(['follow', 'like']),
  platform: z.string(),
  description: z.string(),
  screenshotUrl: z.string(),
  postUrl: z.string().nullable(),
  profileUrl: z.string().nullable(),
  completedBy: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  taskOwner: z
    .object({
      fullName: z.string(),
      email: z.string(),
      phone: z.string(),
    })
    .nullable(),
  coinEarned: z.number(),
  completedAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedCompletedSrkTaskSubmissionsSchema =
  commonPaginationResponse.extend({
    data: z.array(completedSrkTaskSubmissionSchema),
  });

export type TPaginatedCompletedSrkTaskSubmissions = z.infer<
  typeof paginatedCompletedSrkTaskSubmissionsSchema
>;

export const getAllCompletedSrkTaskSubmissionsQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    type: z.enum(['follow', 'like']).optional(),
    platform: z.string().optional(), // 'Instagram', 'YouTube', 'Facebook', 'Twitter', 'TikTok'
  });

export type TGetAllCompletedSrkTaskSubmissionsQueryParams = z.infer<
  typeof getAllCompletedSrkTaskSubmissionsQueryParams
>;

// Bulk Action Schemas
export const bulkApproveSrkTaskSubmissionsSchema = z.object({
  submissionIds: z.array(z.string().min(1)),
});

export const bulkRejectSrkTaskSubmissionsSchema = z.object({
  submissionIds: z.array(z.string().min(1)),
  rejectionReason: z.string().min(1, 'Rejection reason is required'),
});

export type TBulkApproveSrkTaskSubmissions = z.infer<
  typeof bulkApproveSrkTaskSubmissionsSchema
>;
export type TBulkRejectSrkTaskSubmissions = z.infer<
  typeof bulkRejectSrkTaskSubmissionsSchema
>;

export const acceptSrkTaskUserEarningsPayoutSchema = z.object({
  transactionId: z.string(),
  paymentScreenshotUrl: z.string(),
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
  documentUrl: z.string(),
  signatureUrl: z.string(),
  verificationImageUrl: z.string(),
  fullName: z.string(),
  dateOfBirth: z.string(),
});

export type TSubmitTaskOnboardingVerification = z.infer<
  typeof submitTaskOnboardingVerificationSchema
>;

export const srkTaskActionSubmissionBodySchema = z.object({
  actionTodoId: z.string(),
  srkTaskUserId: z.string(),
  actionVerificationImageUrl: z.string(),
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
  taskUserId: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
  }),
  paymentDetails: z
    .object({
      accountHolderName: z.string(),
      bankName: z.string(),
      accountNumber: z.string(),
      branchName: z.string(),
      qrCodeUrl: z.string(),
    })
    .nullable(),
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
  actionId: z.string(),
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
    platform: z.enum(['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook']),
    type: z.enum(['follow', 'like']),
    srkTaskUserId: z.string(),
  });

export type TGetSrkTaskActionsByPlatformsQueryParams = z.infer<
  typeof getSrkTaskActionsByPlatformsQueryParams
>;

// Earnings Statement Schema
export const srkTaskEarningStatementSchema = z.object({
  _id: z.string(),
  taskUserId: z.string(),
  growPackageTodoId: z.string(),
  description: z.string(),
  type: z.enum(['credit', 'debit']),
  coin: z.number(),
  coinAfterTransaction: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginatedSrkTaskUserFinanceStatementSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskEarningStatementSchema),
  });

export type TPaginatedSrkTaskUserFinanceStatement = z.infer<
  typeof paginatedSrkTaskUserFinanceStatementSchema
>;

export const getAllSrkTaskUserFinanceStatementQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    type: z.enum(['credit', 'debit']).optional(),
  });

export type TGetAllSrkTaskUserFinanceStatementQueryParams = z.infer<
  typeof getAllSrkTaskUserFinanceStatementQueryParams
>;

export const getAllTaskAffiliateResponseSchema = z.object({
  _id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .transform((val: any) =>
      val instanceof Types.ObjectId ? val.toHexString() : val
    ),
  srkUniversityUserId: z.string(),
  fullName: z.string(),
  dob: z.string(),
  status: z.string(),
  isActivated: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Onboarding Verification Request Schema
export const srkTaskOnboardingVerificationRequestSchema = z.object({
  _id: z.string(),
  taskUserId: z.object({
    _id: z.string(),
    fullName: z.string(),
    dob: z.string(),
    isActivated: z.boolean(),
    srkUniversityUserId: z.object({
      _id: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
    }),
  }),
  kycDocumentUrl: z.string(),
  imageUrl: z.string(),
  signatureUrl: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  rejectionReason: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TGetAllTaskAffiliateResponseSchema = z.infer<
  typeof getAllTaskAffiliateResponseSchema
>;

export const paginatedSrkTaskOnboardingVerificationRequestSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskOnboardingVerificationRequestSchema),
  });

export type TPaginatedSrkTaskOnboardingVerificationRequest = z.infer<
  typeof paginatedSrkTaskOnboardingVerificationRequestSchema
>;

export const getSrkTaskOnboardingVerificationRequestQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  });

export type TGetSrkTaskOnboardingVerificationRequestQueryParams = z.infer<
  typeof getSrkTaskOnboardingVerificationRequestQueryParams
>;

// ============================================
// Payment Details Schemas
// ============================================

export const srkTaskUserPaymentDetailsSchema = z.object({
  _id: z.string(),
  srkTaskUserId: z.string(),
  accountHolderName: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  branchName: z.string(),
  qrCodeUrl: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TSrkTaskUserPaymentDetails = z.infer<
  typeof srkTaskUserPaymentDetailsSchema
>;

export const srkTaskUserPaymentDetailsRequestSchema = z.object({
  _id: z.string(),
  srkTaskUserId: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      fullName: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
    }),
  ]),
  accountHolderName: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  branchName: z.string(),
  qrCodeUrl: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  rejectionReason: z.string().optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TSrkTaskUserPaymentDetailsRequest = z.infer<
  typeof srkTaskUserPaymentDetailsRequestSchema
>;

export const submitSrkTaskPaymentDetailsRequestSchema = z.object({
  accountHolderName: z.string().min(1, 'Account holder name is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  branchName: z.string().min(1, 'Branch name is required'),
  qrCodeUrl: z.string().min(1, 'Valid QR code URL is required'),
});

export type TSubmitSrkTaskPaymentDetailsRequest = z.infer<
  typeof submitSrkTaskPaymentDetailsRequestSchema
>;

export const reviewSrkTaskPaymentDetailsRequestSchema = z.object({
  requestId: z.string(),
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional(),
});

export type TReviewSrkTaskPaymentDetailsRequest = z.infer<
  typeof reviewSrkTaskPaymentDetailsRequestSchema
>;

export const paginatedSrkTaskPaymentDetailsRequestsSchema =
  commonPaginationResponse.extend({
    data: z.array(srkTaskUserPaymentDetailsRequestSchema),
  });

export type TPaginatedSrkTaskPaymentDetailsRequests = z.infer<
  typeof paginatedSrkTaskPaymentDetailsRequestsSchema
>;

export const getSrkTaskPaymentDetailsRequestsQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  });

export type TGetSrkTaskPaymentDetailsRequestsQueryParams = z.infer<
  typeof getSrkTaskPaymentDetailsRequestsQueryParams
>;

export const getUserPaymentDetailsResponseSchema = z.object({
  success: z.boolean(),
  approvedDetails: srkTaskUserPaymentDetailsRequestSchema.nullable(),
  pendingRequest: srkTaskUserPaymentDetailsRequestSchema.nullable(),
  rejectedRequest: srkTaskUserPaymentDetailsRequestSchema.nullable(),
});

export type TGetUserPaymentDetailsResponse = z.infer<
  typeof getUserPaymentDetailsResponseSchema
>;
