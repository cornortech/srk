import { z } from 'zod';

// ============= Zod Schemas =============

export const SSOCodeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      code: z.string(),
      redirectUrl: z.string(),
      expiresIn: z.number(),
    })
    .optional(),
});

export const SSOExchangeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z
    .object({
      _id: z.string(),
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.string(),
      redirectionUrl: z.string(),
    })
    .optional(),
});

export const SSOErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const SSOGetMeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z
    .object({
      _id: z.string(),
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.string(),
    })
    .optional(),
});

// ============= Inferred Types =============

export type SSOCodeResponse = z.infer<typeof SSOCodeResponseSchema>;
export type SSOExchangeResponse = z.infer<typeof SSOExchangeResponseSchema>;
export type SSOErrorResponse = z.infer<typeof SSOErrorResponseSchema>;
export type SSOGetMeResponse = z.infer<typeof SSOGetMeResponseSchema>;
export type SSOUser = NonNullable<SSOGetMeResponse['user']>;
