import { z } from 'zod';

export const getAllAffiliateRequestsByStatusSchema = z.array(
  z.object({
    userId: z.string(),
    profilePicture: z.string().nullable().optional(),
    email: z.string(),
    firstName: z.string(),
    gender: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    status: z.string(),
    affiliateAgreementUrl: z.string(),
    requestedAt: z.date().optional().nullable(),
    verificationImage: z.string().optional(),
    leftThumbPrint: z.string().optional(),
    rightThumbPrint: z.string().optional(),
  })
);

export const getTeamsOfUserSchema = z.array(
  z.object({
    _id: z.string(),
    email: z.string().email('Invalid email address'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    country: z.string().min(1, 'Country is required'),
    profilePicture: z.string().nullable().optional(),
    purpose: z.string().optional().nullable(),
    gender: z.string(),
    phoneNumber: z.string(),
    createdAt: z.date(),
    packageName: z.string(),
  })
);
