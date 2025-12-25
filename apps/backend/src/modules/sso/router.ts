import { initServer } from '@ts-rest/express';
import { ssoContract } from '@srk/shared/contracts';
import { ssoMutationHandler } from './mutation';
const s = initServer();

export const ssoRouter = s.router(ssoContract, {
  exchangeCode: ssoMutationHandler.exchangeCode,
  getAutoCode: ssoMutationHandler.getAutoCode,
  getMe: ssoMutationHandler.getMe,
});
