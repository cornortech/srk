import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  SSOCodeResponseSchema,
  SSOExchangeResponseSchema,
  SSOErrorResponseSchema,
  SSOGetMeResponseSchema,
} from './schema';

const c = initContract();

// ============= Contract Definition =============

export const ssoContract = c.router(
  {
    /**
     * Generate a one-time SSO code for cross-domain authentication
     * Called from thesrkuniversity.com when user wants to access task app
     */
    getAutoCode: {
      method: 'GET',
      path: '/get-auto-code',
      query: z.object({
        targetApp: z.enum(['task', 'bank']).default('task'),
      }),
      responses: {
        200: SSOCodeResponseSchema,
        401: SSOErrorResponseSchema,
        500: SSOErrorResponseSchema,
      },
      summary: 'Generate one-time SSO code for cross-domain authentication',
    },

    /**
     * Exchange SSO code for JWT token
     * Called from srktask.com to validate code and get authenticated
     */
    exchangeCode: {
      method: 'POST',
      path: '/exchange-code',
      body: z.object({
        code: z.string().min(1, 'Code is required'),
      }),
      responses: {
        200: SSOExchangeResponseSchema,
        400: SSOErrorResponseSchema,
        404: SSOErrorResponseSchema,
        500: SSOErrorResponseSchema,
      },
      summary: 'Exchange SSO code for JWT authentication',
    },

    /**
     * Get current authenticated user from cookie
     * Used to restore session on page refresh
     */
    getMe: {
      method: 'GET',
      path: '/me',
      responses: {
        200: SSOGetMeResponseSchema,
        401: SSOErrorResponseSchema,
        500: SSOErrorResponseSchema,
      },
      summary: 'Get current authenticated user from cookie',
    },
  },
  {
    pathPrefix: '/auth/sso',
  }
);

