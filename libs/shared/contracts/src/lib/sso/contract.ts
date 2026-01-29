import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

// Response schemas
const SSOCodeResponseSchema = z.object({
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

const SSOExchangeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z
    .object({
      universityId: z.string(),
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phoneNumber: z.string().optional(),
      gender: z.string().optional(),
      dob: z.string().optional(),
      country: z.string().optional(),
      bankDetailsId: z.string().optional(),
      role: z.string(),
      redirectionUrl: z.string(),
    })
    .optional(),
});

const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const GetMeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z
    .object({
      universityId: z.string(),
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.string(),
    })
    .optional(),
});

export const ssoContract = c.router({
  /**
   * Generate a one-time SSO code for cross-domain authentication
   * Called from thesrkuniversity.com when user wants to access task app
   */
  getAutoCode: {
    method: 'GET',
    path: '/auth/sso/get-auto-code',
    query: z.object({
      targetApp: z
        .enum(['task', 'growaffiliate', 'growsocialmedia', 'bank'])
        .default('task'),
    }),
    responses: {
      200: SSOCodeResponseSchema,
      401: ErrorResponseSchema,
      500: ErrorResponseSchema,
    },
    summary: 'Generate one-time SSO code for cross-domain authentication',
  },

  /**
   * Exchange SSO code for JWT token
   * Called from srktask.com to validate code and get authenticated
   */
  exchangeCode: {
    method: 'POST',
    path: '/auth/sso/exchange-code',
    body: z.object({
      code: z.string().min(1, 'Code is required'),
    }),
    responses: {
      200: SSOExchangeResponseSchema,
      400: ErrorResponseSchema,
      404: ErrorResponseSchema,
      500: ErrorResponseSchema,
    },
    summary: 'Exchange SSO code for JWT authentication',
  },

  /**
   * Get current authenticated user from cookie
   * Used to restore session on page refresh
   */
  getMe: {
    method: 'GET',
    path: '/auth/sso/me',
    responses: {
      200: GetMeResponseSchema,
      401: ErrorResponseSchema,
      500: ErrorResponseSchema,
    },
    summary: 'Get current authenticated user from cookie',
  },
});
