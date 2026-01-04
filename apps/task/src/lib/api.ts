import { initQueryClient } from '@ts-rest/react-query';
import { apiContract } from '../../../../libs/shared/contracts/src/index';
import { env } from './env';

export const api = initQueryClient(apiContract, {
  baseUrl: env.backendUrl,
  baseHeaders: {},
});