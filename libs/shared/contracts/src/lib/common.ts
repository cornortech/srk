import { z } from "zod";

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
