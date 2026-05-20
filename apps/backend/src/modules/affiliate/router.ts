import { initServer } from '@ts-rest/express';
import { affiliateContract } from '@srk/shared/contracts';
import { affiliateMutationHandler } from './mutation';
import { affiliateQueryHandler } from './query';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const affiliateRouter = s.router(affiliateContract, {
  affiliateRequest: withErrorHandling(affiliateMutationHandler.affiliateRequest),
  approveAffiliateRequest: withErrorHandling(affiliateMutationHandler.approveAffiliateRequest),
  getAllAffiliateRequestsByStatus:
    withErrorHandling(affiliateQueryHandler.getAllAffiliateRequestsByStatus),
  getTeamsOfUser: withErrorHandling(affiliateQueryHandler.getTeamsOfUser),
  addAffiliateBiometricData: withErrorHandling(affiliateMutationHandler.addAffiliateBiometricData),
  rejectAffiliateRequest: withErrorHandling(affiliateMutationHandler.rejectAffiliateRequest),
});
