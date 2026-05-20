import { initServer } from '@ts-rest/express';
import { bankContract } from '@srk/shared/contracts';
import { bankQueryHandlers } from './query';
import { bankMutationHandlers } from './mutation';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const bankRouter = s.router(bankContract, {
  getBankDetails: withErrorHandling(bankQueryHandlers.getBankDetails),
  createBankDetails: withErrorHandling(bankMutationHandlers.createBankDetails),
  getSrkBankRequestByStatus: withErrorHandling(bankQueryHandlers.getSrkBankRequestByStatus),
});
