import { initServer } from '@ts-rest/express';
import { userMutationHandler } from './mutation';
import { userQueryHandler } from './query';
import { userContract } from '@srk/shared/contracts';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const userRouter = s.router(userContract, {
  getUserDetails: withErrorHandling(userQueryHandler.getUserDetails),
  updateUserDetails: withErrorHandling(userMutationHandler.updateUserDetails),
  getRefferedUsersByUserId: withErrorHandling(userQueryHandler.getRefferedUsersByUserId),
  verifyPromocode: withErrorHandling(userMutationHandler.verifyPromocode),
  updatePassword: withErrorHandling(userMutationHandler.updatePassword),
  getAllUsers: withErrorHandling(userQueryHandler.getAllUsers),
});
