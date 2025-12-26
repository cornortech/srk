import { growAffiliateContract } from '@srk/shared/contracts';
import { initServer } from '@ts-rest/express';
import { growAffiliateQueryHandler } from './query';
import { growAffiliateMutationHandler } from './mutation';

const s = initServer();

export const growAffiliateRouter = s.router(growAffiliateContract, {
  getGrowAffiliateUserComissionEarningsDashboard:
    growAffiliateQueryHandler.getGrowAffiliateUserComissionEarningsDashboard,
  getUserAffiliateSalesComissionEarnings:
    growAffiliateQueryHandler.getUserAffiliateSalesComissionEarnings,
  getAllUsersAffiliateComissionLeaderBoard:
    growAffiliateQueryHandler.getAllUsersAffiliateComissionLeaderBoard,
  acceptSrkAffiliateEarningPayout:
    growAffiliateMutationHandler.acceptSrkAffiliateEarningPayout,
  createSrkAffiliateEarningPayout:
    growAffiliateMutationHandler.createSrkAffiliateEarningPayout,
  rejectSrkAffiliateEarningPayout:
    growAffiliateMutationHandler.rejectSrkAffiliateEarningPayout,
  getSrkAffiliateEarningPayoutForAdmin:
    growAffiliateQueryHandler.getAllSrkAffiliateEarningPayoutForAdmin,
});
