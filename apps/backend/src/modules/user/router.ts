import { initServer } from "@ts-rest/express";
import { userMutationHandler } from "./mutation";
import { userContract } from "@srk/shared/contracts";
import { userQueryHandler } from "./query";
const s = initServer();

export const userRouter = s.router(userContract, {
  getUserDetails: userQueryHandler.getUserDetails,
  updateUserDetails: userMutationHandler.updateUserDetails,
  getRefferedUsersByUserId: userQueryHandler.getRefferedUsersByUserId,
  verifyPromocode: userMutationHandler.verifyPromocode,
  updatePassword: userMutationHandler.updatePassword,
  getAllUsers: userQueryHandler.getAllUsers,
});
