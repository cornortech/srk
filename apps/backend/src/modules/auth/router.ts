import { initServer } from '@ts-rest/express';
import { authContract } from '../../contract/auth/contract';
import { authMutationHandler } from './mutation';
import { authQueryHandlers } from './query';
import { authenticate } from '../../middleware/auth.middleware';
const s = initServer();

export const authRouter = s.router(authContract, {
  login: authMutationHandler.login,
  register: authMutationHandler.register,
  getAutoCode: {
    middleware:[authenticate],
    handler: authMutationHandler.getAutoCode,
  },
  exchangeCode: authMutationHandler.exchangeCode,
  approveKyc: authMutationHandler.verifyKyc,
  rejectKyc: authMutationHandler.rejectKyc,
  rejectPaymentDetails: authMutationHandler.rejectPaymentDetails,
  approvePaymentDetails: authMutationHandler.approvePaymentDetails,
  editPaymentDetails: authMutationHandler.editPaymentDetails,
  getProfile: authQueryHandlers.getUserProfile,
});
