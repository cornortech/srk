import { growAffiliateContract } from '@srk/shared/contracts';
import { initServer } from '@ts-rest/express';
import { growAffiliateQueryHandler } from './query';

const s = initServer();

export const growAffiliateRouter = s.router(growAffiliateContract, {
  getGrowAffiliateUserComissionEarningsDashboard: growAffiliateQueryHandler.getGrowAffiliateUserComissionEarningsDashboard,
  getUserAffiliateSalesComissionEarnings: growAffiliateQueryHandler.getUserAffiliateSalesComissionEarnings,
  getAllUsersAffiliateComissionLeaderBoard: growAffiliateQueryHandler.getAllUsersAffiliateComissionLeaderBoard,
});