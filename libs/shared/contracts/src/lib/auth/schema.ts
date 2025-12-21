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
    fullName: z.string().optional(),
    status: z.string().nullable().optional(),
    affiliateEnabled: z.boolean().optional(),
    role: z.union([z.literal('admin'), z.literal('user')]).optional(),
    redirectionUrl: z.string(),
  }),
});

export const RegisterSchema = z
  .object({
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
