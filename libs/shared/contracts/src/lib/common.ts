import { z } from 'zod';

export const SuccessSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  details: z.object({}).optional(),
});

export const ErrorSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  details: z.object({}).optional(),
});

export const commonPaginationResponse = z.object({
  page: z.number(),
  limit: z.number(),
  totalUsers: z.number(),
  totalPages: z.number(),
});

export const commonPaginatedQueryParamsSchema = z.object({
  limit: z.coerce.string().optional(),
  page: z.coerce.string().optional(),
  perPage: z.coerce.string().optional(),
});
