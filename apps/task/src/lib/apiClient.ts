import { initClient } from '@ts-rest/core';
import { ssoContract } from '@srk/shared/contracts';
import { env } from './env';

/**
 * Type-safe API client for Task app using ts-rest
 * Uses shared contracts for end-to-end type safety
 */
export const apiClient = initClient(ssoContract, {
  baseUrl: env.backendUrl,
  baseHeaders: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important for sending cookies
});

export default apiClient;