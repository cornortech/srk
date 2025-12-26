import {
    initContract
} from "@ts-rest/core";
import {
    paginatedGetAllUsersAffiliateComissionLeaderBoardSchema,
    getGrowAffiliateUserCommissionEarningsDashboardSchema,
    getUserAffiliateSalesComissionEarningsSchema,
    getAllUsersAffiliateComissionLeaderBoardQueryParams,
} from "./schema";
import { ErrorSchema } from "../../common";

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
        query: getAllUsersAffiliateComissionLeaderBoardQueryParams.optional(),
        responses: {
            200: paginatedGetAllUsersAffiliateComissionLeaderBoardSchema,
            500: ErrorSchema,
        },
        summary: 'Get all user affiliate leaderboard with total sales(referrals) and revenue overall',
    },
})