import { initQueryClient } from '@ts-rest/react-query';
import { env } from './env';
import { apiContract } from '@srk/shared/contracts';

export const api = initQueryClient(apiContract, {
  baseUrl: env.backendUrl,
  baseHeaders: {},
});