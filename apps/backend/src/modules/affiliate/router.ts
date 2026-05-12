import { initServer } from '@ts-rest/express';
import { affiliateContract } from '@srk/shared/contracts';
import { affiliateMutationHandler } from './mutation';
import { affiliateQueryHandler } from './query';
const s = initServer();

export const affiliateRouter = s.router(affiliateContract, {
  affiliateRequest: affiliateMutationHandler.affiliateRequest,
  approveAffiliateRequest: affiliateMutationHandler.approveAffiliateRequest,
  getAllAffiliateRequestsByStatus:
    affiliateQueryHandler.getAllAffiliateRequestsByStatus,
  getTeamsOfUser: affiliateQueryHandler.getTeamsOfUser,
  addAffiliateBiometricData: affiliateMutationHandler.addAffiliateBiometricData,
  rejectAffiliateRequest: affiliateMutationHandler.rejectAffiliateRequest,
});
