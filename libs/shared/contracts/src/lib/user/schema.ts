import { z } from 'zod';

export const getUserDetailsSchema = z.object({
  userDetails: z.object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    country: z.string(),
    profilePicture: z.string().nullable().optional(),
    referralCode: z.string().nullable().optional(),
    dob: z.date(),
    gender: z.string(),
    phoneNumber: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    referredBy: z.string(),
    status: z.string(),
    isActive: z.boolean(),
    allowedToAddUsers: z.boolean(),
    purpose: z.enum(['affiliate', 'study']).optional().nullable(),
    packageId: z.object({
      _id: z.string(),
      title: z.string(),
      description: z.string(),
      image: z.string(),
      price: z.number(),
      currency: z.string(),
      features: z.array(z.string()),
      created_at: z.date(),
      updated_at: z.date(),
      discountedPrice: z.number().nullable(),
    }),
  }),
  bankDetails: z
    .object({
      accountHolderName: z.string().min(1, 'Account holder name is required'),
      accountNumber: z.string().min(1, 'Account number is required'),
      ifscCode: z.string().optional(),
      status: z.string().optional(),
      bankName: z.string().min(1, 'Bank name is required'),
      branchName: z.string().min(1, 'Branch name is required'),
      accountType: z.string().min(1, 'Account type is required'),
      relationWithAccount: z.string().min(1, 'Relation is required'),
      qrUrl: z.string(),
      rejectionReason: z.string().nullable().optional(),
    })
    .nullable(),
  kycDetails: z
    .object({
      status: z.string(),
      rejectionReason: z.string().nullable().optional(),
      frontImage: z.string().min(1, 'Front image is required'),
      backImage: z.string().min(1, 'Back image is required'),
      documentType: z.string().min(1, 'Document type is required'),
      documentNumber: z.string().min(1, 'Document number is required'),
      verificationImage: z.string().min(1, 'Verification image is required'),
    })
    .nullable(),
  affiliateBiometricDetails: z
    .object({
      verificationImage: z.string(),
      leftThumbPrint: z.string(),
      rightThumbPrint: z.string(),
    })
    .nullable(),
  affiliateRequestDetails: z
    .object({
      status: z.string(),
      rejectionReason: z.string().nullable().optional(),
      requestedAt: z.date().optional().nullable(),
    })
    .nullable(),
  paymentDetails: z
    .object({
      rejectionReason: z.string(),
      transactionId: z.string(),
      paymentType: z.string(),
      paymentMethod: z.string(),
      paymentProofUrl: z.string(),
    })
    .nullable(),
  redirectionUrl: z.string(),
});

export const updateUserDetailsSchema = z.object({
  userDetails: z
    .object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      email: z.string().email('Invalid email address'),
      country: z.string().min(1, 'Country is required'),
      allowedToAddUsers: z.boolean().nullable().optional(),
      profilePicture: z.string().optional(),
      phoneNumber: z.string(),
      isActive: z.boolean(),
      purpose: z.enum(['affiliate', 'study']).optional().nullable(),
      dob: z
        .string()
        .refine(
          (value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
          },
          { message: 'Invalid date of birth' }
        )
        .optional(),
      gender: z.enum(['Male', 'Female', 'Other']).optional(),
    })
    .partial(),
  bankDetails: z
    .object({
      holderName: z.string().min(1, 'Account holder name is required'),
      accountNumber: z.string().min(1, 'Account number is required'),
      confirmAccountNumber: z.string().min(1, 'Confirm account number is required'),
      ifscCode: z.string().optional(),
      bankName: z.string().min(1, 'Bank name is required'),
      branchName: z.string().min(1, 'Branch name is required'),
      accountType: z.string().min(1, 'Account type is required'),
      relationWithAccountHolder: z.string().optional(),
      qrUrl: z.string().optional(),
    })
    .nullable(),
  kycDetails: z
    .object({
      status: z.string(),
      frontImage: z.string().min(1, 'Front image is required'),
      backImage: z.string().min(1, 'Back image is required'),
      documentType: z.string().min(1, 'Document type is required'),
      documentNumber: z.string().min(1, 'Document number is required'),
    })
    .nullable(),
});

export const getReferralTeamSchema = z.array(
  z.object({
    _id: z.string(),
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    country: z.string().min(1, 'Country is required'),
    profilePicture: z.string().nullable().optional(),
    gender: z.string(),
    phoneNumber: z.string(),
    referredAt: z.date(),
  })
);

export const checkPromocodeOfUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  referralCode: z.string(),
});

export const getAllUsersSchema = z.array(
  z.object({
    _id: z.string(),
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    country: z.string().min(1, 'Country is required'),
    profilePicture: z.string().nullable().optional(),
    gender: z.string(),
    phoneNumber: z.string(),
    referredAt: z.date(),
    dob: z.date(),
    allowedToAddUsers: z.boolean(),
    status: z.string(),
    isSelfSignup: z.boolean(),
    isActive: z.boolean(),
    courseEnrollAgreementUrl: z.string().optional(),
    purpose: z.enum(['affiliate', 'study']).optional().nullable(),
    packageId: z.object({
      _id: z.string(),
      title: z.string(),
      description: z.string(),
      price: z.number().nullable(),
      discountedPrice: z.number().nullable(),
    }),
    seniorUser: z
      .object({
        _id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .nullable()
      .optional(),
    referredBy: z
      .object({
        _id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
      })
      .nullable(),
    kycDetails: z
      .object({
        _id: z.string(),
        status: z.string(),
        rejectionReason: z.string().nullable().optional(),
        frontImage: z.string(),
        backImage: z.string(),
        documentType: z.string(),
        documentNumber: z.string(),
        verificationImage: z.string(),
      })
      .nullable(),
    paymentDetails: z
      .object({
        paymentProofUrl: z.string(),
        paymentMethod: z.string(),
        paymentType: z.string(),
        transactionId: z.string().optional(),
      })
      .nullable(),
  })
);

// Inferred types
export type GetUserDetails = z.infer<typeof getUserDetailsSchema>;
export type UpdateUserDetails = z.infer<typeof updateUserDetailsSchema>;
export type GetReferralTeam = z.infer<typeof getReferralTeamSchema>;
export type CheckPromocodeOfUser = z.infer<typeof checkPromocodeOfUserSchema>;
export type GetAllUsers = z.infer<typeof getAllUsersSchema>;
