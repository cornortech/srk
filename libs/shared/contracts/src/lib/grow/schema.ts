import z, { isAborted } from 'zod';
import {
  commonPaginatedQueryParamsSchema,
  commonPaginationResponse,
} from '../common';

export const createGrowSocialMediaEnrollmentSchema = z.object({
  userData: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    gender: z.enum(['Male', 'Female', 'Other']),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    country: z.string().min(1, 'Country is required'),
    kycURL: z.array(z.string()).optional(),
    usedPromoCode: z.string().optional(),
  }),
  enrollmentData: z.object({
    growSocialMediaPackageId: z.string(),
    growSocialMediaPackageTypeId: z.string(),
    growSocialMediaPackageSubTypeId: z.string(),
    socialMediaPlatform: z.string(),
    profileLinkURL: z.array(z.string().url('Invalid Profile Url')).optional(),
  }),
  paymentData: z.object({
    paymentURL: z.string().url('Invalid payment URL'),
    transactionId: z.string().min(1, 'Transaction ID is required'),
    paymentMethod: z.enum(['esewa', 'khalti', 'bankTransfer']),
  }),
  postEngagement: z
    .object({
      postURLs: z.array(z.string().url('Invalid Post URL')).optional(),
    })
    .optional(),
});

export type TCreateGrowSocialMediaEnrollment = z.infer<
  typeof createGrowSocialMediaEnrollmentSchema
>;

export const getGrowSocialMediaEnrollmentByIdSchema = z.object({
  _id: z.string(),
  userData: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    gender: z.enum(['Male', 'Female', 'Other']),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    country: z.string().min(1, 'Country is required'),
    kycURL: z.string().url('Invalid KYC URL'),
    usedPromoCode: z.string().optional(),
    status: z.string(),
  }),
  enrollmentData: z.object({
    growSocialMediaPackageId: z.string(),
    growSocialMediaPackageTypeId: z.string(),
    growSocialMediaPackageSubTypeId: z.string(),
    profileLinkURL: z.array(
      z.string().url('Invalid Profile Link URL').optional()
    ),
    isActive: z.boolean().optional(),
    packageName: z.string().optional(),
    packageTypeName: z.string().optional(),
    packageSubTypeName: z.string().optional(),
    socialMediaPlatform: z.string().optional(),
    noOfFollowers: z.number().optional(),
    noOfLikes: z.number().optional(),
    noOfVideos: z.number().optional(),
  }),
  paymentData: z.object({
    paymentURL: z.string().url('Invalid payment URL'),
    transactionId: z.string().min(1, 'Transaction ID is required'),
    paymentMethod: z.enum(['esewa', 'khalti', 'bankTransfer']),
    rejectionReason: z.string(),
  }),
  postEngagement: z.object({
    postURLs: z.array(z.string().url('Invalid Post URL')).optional(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TGetGrowSocialMediaEnrollmentById = z.infer<
  typeof getGrowSocialMediaEnrollmentByIdSchema
>;

export const getAllGrowSocialMediaEnrollmentSchema = z.array(
  getGrowSocialMediaEnrollmentByIdSchema
);

export const validateGrowUserPromoCodeSchema = z.object({
  promoCode: z.string().min(1, 'Promo code is required'),
  growSocialMediaPackageId: z.string().min(1, 'Package ID is required'),
});

export type TValidateGrowUserPromoCode = z.infer<
  typeof validateGrowUserPromoCodeSchema
>;

export const validateGrowUserPromoCodeResponseSchema = z.object({
  discountDetails: z.object({
    originalAmount: z.number().min(0),
    discountPercentage: z.number().min(0).max(100),
    discountAmount: z.number().min(0),
    finalAmountAfterDiscount: z.number().min(0),
  }),
});

export type TValidateGrowUserPromoCodeResponse = z.infer<
  typeof validateGrowUserPromoCodeResponseSchema
>;

export const srkGrowAffiliateVerificationRequestSchema = z.object({
  _id: z.string(),
  verificationRequestId: z.string(),
  username: z.string(),
  email: z.string(),
  verificationImageUrl: z.string(),
  createdAt: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

export const getAllSrkGrowAffiliateVerificationRequestSchema = z.array(
  srkGrowAffiliateVerificationRequestSchema
);

export const paginatedGetAllSrkGrowAffiliateVerificationSchema =
  commonPaginationResponse.extend({
    data: getAllSrkGrowAffiliateVerificationRequestSchema,
  });

export const getAllSrkGrowAffiliateVerificationQueryParams =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  });

export const srkGrowUsersSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  email: z.string(),
  referredBy: z.string().optional(),
  status: z.enum([
    'verificationPending',
    'portalActivated',
    'verificationRejected',
  ]),
  socialMediaPackage: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  createdAt: z.string(),
  walletBalance: z.number().optional(),
  totalReferrals: z.number().optional(),
});

export const srkGrowAffiliateVerificationSchema = z.object({
  srkUniversityUserId: z.string(),
  verificationImageUrl: z.string(),
});

export const getAllSrkGrowUsersQueryParams = z.object({
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const getAllSrkGrowUsersResponseSchema = z.object({
  data: z.array(srkGrowUsersSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type TGetAllSrkGrowUsersResponse = z.infer<
  typeof getAllSrkGrowUsersResponseSchema
>;

export const getSrkGrowProfileResponseSchema = z.object({
  userDetails: z.object({
    _id: z.string(),
    srkUniversityId: z.string().optional(),
    fullName: z.string(),
    email: z.string(),
    status: z.string(),
    phone: z.string().optional(),
    kycURL: z.array(z.string()),
    country: z.string().optional(),
    gender: z.string().optional(),
    promoCode: z.string().optional(),
    profileLinkURL: z.array(z.string().url()).optional(),
    referredBy: z
      .object({
        name: z.string(),
      })
      .nullable(),
    createdAt: z.string(),
    // Enhanced profile details
    totalReferrals: z.number().optional(),
    activeReferrals: z.number().optional(),
  }),
  enrollmentData: z
    .object({
      _id: z.string().optional(),
      isActive: z.boolean().optional(),
      enrollmentPackageDetails: z.object({
        name: z.string(),
        amount: z.number(),
        socialMediaPlatform: z.string(),
        packageType: z.object({
          name: z.string(),
          packageSubType: z.object({
            name: z.string(),
            noOfLikes: z.number().optional(),
            noOfVideos: z.number().optional(),
            noOfFollowers: z.number().optional(),
          }),
        }),
      }),
      // Enhanced engagement data with acquired/total counts
      engagementPostURLs: z
        .array(
          z.object({
            url: z.string().url(),
            likesAcquired: z.number(),
            likesTarget: z.number(),
            progress: z.number(), // percentage
          })
        )
        .optional(),
      // Enhanced profile link data
      profileLinks: z
        .array(
          z.object({
            url: z.string().url(),
            followersAcquired: z.number(),
            followersTarget: z.number(),
            progress: z.number(), // percentage
          })
        )
        .optional(),
      // Overall analytics summary
      analytics: z
        .object({
          totalFollowersAcquired: z.number(),
          totalFollowersTarget: z.number(),
          followersProgress: z.number(),
          totalLikesAcquired: z.number(),
          totalLikesTarget: z.number(),
          likesProgress: z.number(),
          overallProgress: z.number(),
        })
        .optional(),
      enrollmentPaymentDetails: z
        .object({
          paymentUrl: z.string(),
          transactionId: z.string(),
          paymentMethod: z.string().optional(),
          rejectionReason: z.string().optional(),
        })
        .nullable(),
    })
    .nullable(),
});

export type TGetSrkGrowProfileResponse = z.infer<
  typeof getSrkGrowProfileResponseSchema
>;

export const resubmitGrowVerificationSchema = z.object({
  userId: z.string(),
  kycURLs: z.array(z.string()).optional(),
  transactionId: z.string(),
  paymentURL: z.string(),
});

export type TResubmitGrowVerification = z.infer<
  typeof resubmitGrowVerificationSchema
>;

export const createGrowSocialMediaTasksSchema = z.object({
  growSocialMediaPackageEnrollmentId: z.string(),
  profileLinkURLs: z.array(z.string().url()).optional(),
  postURLs: z.array(z.string().url()).optional(),
});

export type TCreateGrowSocialMediaTasks = z.infer<
  typeof createGrowSocialMediaTasksSchema
>;

// Affiliate Earning Payout Schemas
export const createGrowSrkAffiliateEarningPayoutRequestSchema = z.object({
  srkGrowUserId: z.string(),
  amount: z.number().positive(),
});

export type TCreateGrowSrkAffiliateEarningPayoutRequest = z.infer<
  typeof createGrowSrkAffiliateEarningPayoutRequestSchema
>;

export const acceptGrowSrkAffiliateEarningPayoutRequestSchema = z.object({
  transactionId: z.string(),
  paymentUrl: z.string().url().optional(),
});

export type TAcceptGrowSrkAffiliateEarningPayoutRequest = z.infer<
  typeof acceptGrowSrkAffiliateEarningPayoutRequestSchema
>;

export const rejectGrowSrkAffiliateEarningPayoutRequestSchema = z.object({
  rejectionReason: z.string(),
});

export type TRejectGrowSrkAffiliateEarningPayoutRequest = z.infer<
  typeof rejectGrowSrkAffiliateEarningPayoutRequestSchema
>;

export const growSrkAffiliateEarningPayoutSchema = z.object({
  _id: z.string(),
  srkGrowUser: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string().optional(),
  }),
  amount: z.number(),
  status: z.enum(['pending', 'approved', 'rejected']),
  transactionId: z.string().optional(),
  paymentUrl: z.string().optional(),
  rejectionReason: z.string().optional(),
  paidAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TGrowSrkAffiliateEarningPayout = z.infer<
  typeof growSrkAffiliateEarningPayoutSchema
>;

export const paginatedGrowSrkAffiliateEarningPayoutsSchema =
  commonPaginationResponse.extend({
    data: z.array(growSrkAffiliateEarningPayoutSchema),
  });

export type TPaginatedGrowSrkAffiliateEarningPayouts = z.infer<
  typeof paginatedGrowSrkAffiliateEarningPayoutsSchema
>;

export const getSrkGrowAffiliateEarningPayoutQueryParamsSchema =
  commonPaginatedQueryParamsSchema.extend({
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
  });

export type TGetSrkGrowAffiliateEarningPayoutQueryParams = z.infer<
  typeof getSrkGrowAffiliateEarningPayoutQueryParamsSchema
>;

// Task Monitoring Schemas
export const taskCompletionSchema = z.object({
  total: z.number(),
  completed: z.number(),
  percentage: z.number(),
});

export const followProfileSchema = z.object({
  profileUrl: z.string(),
  followCounts: z.number(),
  totalRequired: z.number(),
  percentage: z.number(),
});

export const videoTaskSchema = z.object({
  postUrl: z.string(),
  profileUrl: z.string(),
  likeCounts: z.number(),
  totalRequired: z.number(),
  percentage: z.number(),
});

export const platformTasksSchema = z.object({
  follow: taskCompletionSchema,
  like: taskCompletionSchema,
  videos: z.array(videoTaskSchema).optional(),
  profiles: z.array(followProfileSchema).optional(),
});

export const taskMonitoringUserSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  email: z.string(),
  status: z.enum([
    'verificationPending',
    'portalActivated',
    'portalDeactivated',
    'verificationRejected',
  ]),
  enrollmentId: z.string(),
  platform: z.enum(['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook']),
  packageName: z.string(),
  packageSubTypeName: z.string(),
  tasks: platformTasksSchema,
  overallCompletionPercentage: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export const taskMonitoringResponseSchema = z.array(taskMonitoringUserSchema);

export type TTaskMonitoringUser = z.infer<typeof taskMonitoringUserSchema>;
export type TTaskMonitoringResponse = z.infer<
  typeof taskMonitoringResponseSchema
>;

export const toggleEnrollmentActiveStatusSchema = z.object({
  enrollmentId: z.string().min(1, 'Enrollment ID is required'),
});

export type TToggleEnrollmentActiveStatus = z.infer<
  typeof toggleEnrollmentActiveStatusSchema
>;

export const globalOverviewResponseSchema = z.object({
  totalRevenue: z.number(),
  totalLiability: z.number(),
  affiliateCount: z.number(),
  trends: z.array(
    z.object({
      month: z.string(),
      revenue: z.number(),
      users: z.number(),
    })
  ),
});

export type TGlobalOverviewResponse = z.infer<
  typeof globalOverviewResponseSchema
>;

export const globalOverviewQuerySchema = z.object({
  timeRange: z.enum(['6months', '1year', 'all']).optional().default('6months'),
});

export type TGlobalOverviewQuery = z.infer<typeof globalOverviewQuerySchema>;

// Affiliate User Schemas
export const getGrowAffiliateUserResponseSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  email: z.string(),
  gender: z.string().optional(),
  promocode: z.string(),
  srkUniversityUserId: z.string().optional(),
  walletBalance: z.number(),
  totalEarnings: z.number(),
  totalReferrals: z.number(),
  activeReferrals: z.number(),
  totalPayouts: z.number(),
  pendingPayouts: z.number(),
  referrals: z
    .array(
      z.object({
        _id: z.string(),
        fullName: z.string(),
        email: z.string(),
        status: z.string(),
        packageName: z.string(),
        amount: z.number(),
        createdAt: z.string(),
      })
    )
    .optional(),
  earningStatements: z
    .array(
      z.object({
        _id: z.string(),
        amount: z.number(),
        referredTo: z.object({
          fullName: z.string(),
          email: z.string(),
        }),
        package: z.object({
          name: z.string(),
        }),
        createdAt: z.string(),
      })
    )
    .optional(),
  payoutRequests: z
    .array(
      z.object({
        _id: z.string(),
        amount: z.number(),
        status: z.string(),
        transactionId: z.string().optional(),
        rejectionReason: z.string().optional(),
        createdAt: z.string(),
        paidAt: z.string().optional(),
      })
    )
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TGetGrowAffiliateUserResponse = z.infer<
  typeof getGrowAffiliateUserResponseSchema
>;

// Get All Affiliate Users Schema
export const getAllSrkGrowAffiliateUsersQueryParams = z.object({
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const affiliateUserListItemSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  email: z.string(),
  status: z.string(),
  createdAt: z.string(),
  walletBalance: z.number(),
  totalReferrals: z.number(),
});

export const getAllSrkGrowAffiliateUsersResponseSchema = z.object({
  data: z.array(affiliateUserListItemSchema),
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export type TGetAllSrkGrowAffiliateUsersResponse = z.infer<
  typeof getAllSrkGrowAffiliateUsersResponseSchema
>;

export const getGrowAffiliateVerificationResponseSchema = z.object({
  affiliateVerificationRequest: z
    .object({
      _id: z.string(),
      verificationRequestId: z.string(),
      username: z.string(),
      email: z.string(),
      verificationImageUrl: z.string(),
      createdAt: z.string(),
      status: z.enum(['pending', 'approved', 'rejected']),
      rejectionReason: z.string().optional(),
    })
    .optional(),
  affiliateUser: z
    .object({
      _id: z.string(),
      fullName: z.string(),
      email: z.string(),
      gender: z.string().optional(),
      promocode: z.string(),
      srkUniversityUserId: z.string().optional(),
      isActive: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .nullable(),
});

export type TGetGrowAffiliateVerificationResponse = z.infer<
  typeof getGrowAffiliateVerificationResponseSchema
>;
