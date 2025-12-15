import { initServer } from "@ts-rest/express";
import { authContract } from "@srk/shared/contracts";
import { authMutationHandler } from "./mutation";
const s = initServer();

export const authRouter = s.router(authContract, {
  login: authMutationHandler.login,
  register: authMutationHandler.register,
  approveKyc: authMutationHandler.verifyKyc,
  rejectKyc: authMutationHandler.rejectKyc,
  rejectPaymentDetails: authMutationHandler.rejectPaymentDetails,
  approvePaymentDetails: authMutationHandler.approvePaymentDetails,
  editPaymentDetails: authMutationHandler.editPaymentDetails,
});