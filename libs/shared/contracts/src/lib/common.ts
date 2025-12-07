import { z } from 'zod';

/**
 * Common response schemas used across all contracts
 */

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

// Infer types from schemas
export type SuccessResponse = z.infer<typeof SuccessSchema>;
export type ErrorResponse = z.infer<typeof ErrorSchema>;
