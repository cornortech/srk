import { initContract } from '@ts-rest/core';
import {
  paginatedGetAllUsersAffiliateComissionLeaderBoardSchema,
  getGrowAffiliateUserCommissionEarningsDashboardSchema,
  getUserAffiliateSalesComissionEarningsSchema,
  getAllUsersAffiliateComissionLeaderBoardQueryParams,
  createSrkAffiliateEarningPayoutBodySchema,
  rejectSrkAffiliateEarningPayoutBodySchema,
  acceptSrkAffiliateEarningPayoutBodySchema,
  getPaginatedGetSrkAffiliateEarningPayoutForAdminSchema,
  getSrkAffiliateEarningPayoutForAdminQueryParamsSchema,
  getAffiliateUsersProfileSchema,
} from './schema';
import { ErrorSchema, SuccessSchema } from '../../common';

const c = initContract();

export const growAffiliateContract = c.router({
  getGrowAffiliateUserComissionEarningsDashboard: {
    method: 'GET',
    path: '/affiliate/user-balance-dashboard/:affiliateUserId',
    responses: {
      200: getGrowAffiliateUserCommissionEarningsDashboardSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get srk grow affiliate user earnings balance',
  },

  getUserAffiliateSalesComissionEarnings: {
    method: 'GET',
    path: '/affiliate/affiliate-earnings/:affiliateUserId',
    responses: {
      200: getUserAffiliateSalesComissionEarningsSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get grow affiliate user total package sales and earnings',
  },

  getAllUsersAffiliateComissionLeaderBoard: {
    method: 'GET',
    path: '/affiliate/leaderboard',
    query: getAllUsersAffiliateComissionLeaderBoardQueryParams,
    responses: {
      200: paginatedGetAllUsersAffiliateComissionLeaderBoardSchema,
      500: ErrorSchema,
    },
    summary:
      'Get all user affiliate leaderboard with total sales(referrals) and revenue overall',
  },

  getGrowAffiliateUser: {
    method: "GET",
    path: "/get-grow-affiliate-user-profile/:id",
    responses: {
      200: getAffiliateUsersProfileSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Get Grow Affiliate User Profile by Id"
  },

  createSrkAffiliateEarningPayout: {
    method: 'POST',
    path: '/affiliate/earning-payout',
    body: createSrkAffiliateEarningPayoutBodySchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a payout for SRK affiliate earnings',
  },

  acceptSrkAffiliateEarningPayout: {
    method: 'POST',
    path: '/affiliate/earning-payout/accept/:payoutId',
    body: acceptSrkAffiliateEarningPayoutBodySchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Accept a payout for SRK affiliate earnings',
  },

  rejectSrkAffiliateEarningPayout: {
    method: 'POST',
    path: '/affiliate/earning-payout/reject/:payoutId',
    body: rejectSrkAffiliateEarningPayoutBodySchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject a payout for SRK affiliate earnings',
  },

  getSrkAffiliateEarningPayoutForAdmin: {
    method: 'GET',
    path: '/affiliate/earning-payout/admin',
    query: getSrkAffiliateEarningPayoutForAdminQueryParamsSchema.optional(),
    responses: {
      200: getPaginatedGetSrkAffiliateEarningPayoutForAdminSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get SRK affiliate earning payouts for admin',
  },
});
