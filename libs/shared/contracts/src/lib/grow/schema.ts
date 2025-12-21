import z from 'zod';

export const createGrowSocialMediaEnrollmentSchema = z.object({
  userData: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    gender: z.enum(['Male', 'Female', 'Other']),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    country: z.string().min(1, 'Country is required'),
    kycURL: z.array(z.string()),
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
    profileLinkURL: z.string().url('Invalid Profile Link URL').optional(),
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

export const srkGrowUsersSchema = z.object({
  _id: z.string(),
  fullName: z.string(),
  referredBy: z.string().optional(),
  status: z.enum([
    'verificationPending',
    'portalActivated',
    'portalDeactivated',
  ]),
  socialMediaPackage: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});

export const getAllSrkGrowUsersResponseSchema = z.array(srkGrowUsersSchema);

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
    userType: z.enum(['affiliate', 'package']),
    referredBy: z
      .object({
        name: z.string(),
      })
      .nullable(),
    createdAt: z.string(),
  }),
  enrollmentData: z
    .object({
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
      engagementPostURLs: z.array(z.string().url()).optional(),
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
  kycURLs: z.array(z.string()),
  transactionId: z.string(),
  paymentURL: z.string(),
});

export type TResubmitGrowVerification = z.infer<
  typeof resubmitGrowVerificationSchema
>;
