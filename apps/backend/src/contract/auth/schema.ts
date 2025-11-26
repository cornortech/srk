import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const LoginSuccessResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  user: z.object({
    _id: z.string(),
    email: z.string().email(),
    status: z.string().nullable(),
    affiliateEnabled: z.boolean(),
    role: z.union([z.literal('admin'), z.literal('user')]),
    redirectionUrl: z.string(),
  }),
});

export const RegisterSchema = z
  .object({
    uid: z.string(),
    email: z.string(),
    password: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    country: z.string(),
    profilePicture: z.string().optional(),
    dob: z.string(),
    gender: z.string(),
    phoneNumber: z.string(),
    referredBy: z.string(),
    packageId: z.string(),
    isAddedByUser: z.boolean().optional(),
    paymentProofUrl: z.string().optional(),
    transactionId: z.string().optional(),
    paymentType: z.enum(['qr', 'onlinePayment']).optional(),
    paymentMethod: z.enum(['esewa', 'khalti', 'bankTransfer']).optional(),
    purpose: z.enum(['affiliate', 'study']),
  })
  .refine(
    (data) => {
      // Require password only if isAddedByUser is false or undefined
      return data.password || data.isAddedByUser;
    },
    { message: 'Password is required', path: ['password'] }
  );

export const getAuthUserDetailsSchema = z.object({
  authDetails: z.object({
    role: z.union([z.literal('admin'), z.literal('user')]),
    email: z.string().email(),
    redirectionUrl: z.string(),
  }),
  userDetails: z
    .object({
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
    })
    .nullable(),
  srkBank: z
    .object({
      _id: z.string().nullable(),
      accountNumber: z.string().min(1, 'Account number is required').nullable(),
      status: z.string().min(1, 'Status is required').nullable(),
    })
    .nullable(),
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
});
