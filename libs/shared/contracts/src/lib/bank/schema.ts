import { z } from 'zod';

export const createBankDetailsSchema = z.object({
  holderName: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
});

export const getBankDetailsSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  holderName: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  ifscCode: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getSrkBankRequestByStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});

// Inferred types
export type CreateBankDetails = z.infer<typeof createBankDetailsSchema>;
export type GetBankDetails = z.infer<typeof getBankDetailsSchema>;
export type GetSrkBankRequestByStatus = z.infer<typeof getSrkBankRequestByStatusSchema>;
