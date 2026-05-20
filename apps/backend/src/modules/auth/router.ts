import { initServer } from '@ts-rest/express';
import { authContract } from '@srk/shared/contracts';
import { authMutationHandler } from './mutation';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const authRouter = s.router(authContract, {
  login: withErrorHandling(authMutationHandler.login),
  register: withErrorHandling(authMutationHandler.register),
  approveKyc: withErrorHandling(authMutationHandler.verifyKyc),
  rejectKyc: withErrorHandling(authMutationHandler.rejectKyc),
  rejectPaymentDetails: withErrorHandling(authMutationHandler.rejectPaymentDetails),
  approvePaymentDetails: withErrorHandling(authMutationHandler.approvePaymentDetails),
  editPaymentDetails: withErrorHandling(authMutationHandler.editPaymentDetails),
  loginSrkGrow: withErrorHandling(authMutationHandler.loginSrkGrow),
  logout: withErrorHandling(authMutationHandler.logout),
  refreshToken: withErrorHandling(authMutationHandler.refreshToken),
  forgotPassword: withErrorHandling(authMutationHandler.forgotPassword),
  resetPassword: withErrorHandling(authMutationHandler.resetPassword),
  forgotPasswordSrkGrow: withErrorHandling(authMutationHandler.forgotPasswordSrkGrow),
  resetPasswordSrkGrow: withErrorHandling(authMutationHandler.resetPasswordSrkGrow),
});