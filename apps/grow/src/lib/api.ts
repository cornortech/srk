import { initQueryClient } from '@ts-rest/react-query';
import { apiContract } from '@srk/shared/contracts';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const api = initQueryClient(apiContract, {
  baseUrl,
  baseHeaders: {},
});
