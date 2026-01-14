import { initQueryClient } from '@ts-rest/react-query';
import { apiContract } from '@srk/shared/contracts';
import { env } from './env';

export const api = initQueryClient(apiContract, {
  baseUrl: env.backendUrl,
  baseHeaders: {},
  credentials: 'include',
});
