import { initServer } from '@ts-rest/express';
import { userMutationHandler } from './mutation';
import { userQueryHandler } from './query';
import { userContract } from '@srk/shared/contracts';
const s = initServer();

export const userRouter = s.router(userContract, {
  getUserDetails: userQueryHandler.getUserDetails,
  updateUserDetails: userMutationHandler.updateUserDetails,
  getRefferedUsersByUserId: userQueryHandler.getRefferedUsersByUserId,
  verifyPromocode: userMutationHandler.verifyPromocode,
  updatePassword: userMutationHandler.updatePassword,
  getAllUsers: userQueryHandler.getAllUsers,
});
