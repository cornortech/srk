import { initContract } from "@ts-rest/core";
import { acceptSrkTaskUserEarningsPayoutSchema, getSrkTaskUserAnalyticsSchema, getSrkTaskUserEarningsLeaderboardQueryParams, getSrkTaskUserProfileSchema, paginatedSrkTaskUserEarningsLeaderboardSchema, rejectSrkTaskUserEarningsPayoutSchema } from "./schema";
import { ErrorSchema, SuccessSchema } from "../../common";

const c = initContract();

export const srkTaskContract = c.router({
    getSrkTaskUserProfile: {
        method: 'GET',
        path: '/task/srk-task-user-profile/:userId',
        responses: {
            200: getSrkTaskUserProfileSchema,
            404: ErrorSchema,
            500: ErrorSchema
        },
        summary: 'Get SRK Task User Profile details by Id',
    },

    getSrkTaskUserAnalytics: {
        method: 'GET',
        path: '/task/srk-task-user-analytics/:userId',
        responses: {
            200: getSrkTaskUserAnalyticsSchema,
            400: ErrorSchema,
            500: ErrorSchema
        },
        summary: 'Get SRK Task User Analytics details by Id',
    },

    getAllSrkTaskUserEarningsLeaderboard: {
        method: 'GET',
        path: '/task/srk-task-user-earnings-leaderboard',
        query: getSrkTaskUserEarningsLeaderboardQueryParams,
        responses: {
            200: paginatedSrkTaskUserEarningsLeaderboardSchema,
            500: ErrorSchema,
        },
        summary: 'Get all srk task user earnings Leaderboard',
    },

    acceptSrkTaskUserEarningsPayout: {
        method: 'POST',
        path: '/task/accept-earning-payout/:payoutId',
        body: acceptSrkTaskUserEarningsPayoutSchema,
        responses: {
            201: SuccessSchema,
            400: ErrorSchema,
            500: ErrorSchema,
        },
        summary: 'Accept payout request for srk task user earnings',
    },

    rejectSrkTaskUserEarningsPayout: {
        method: 'POST',
        path: '/task/reject-earning-payout/:payoutId',
        body: rejectSrkTaskUserEarningsPayoutSchema,
        responses: {
            201: SuccessSchema,
            400: ErrorSchema,
            500: ErrorSchema,
        },
        summary: 'Reject payout request for srk task user earnings',
    },
});