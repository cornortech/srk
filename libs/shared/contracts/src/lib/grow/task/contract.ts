import {
  paginatedSrkTaskActionSubmissionsByStatusForAdminSchema,
  getSrkTaskActionSubmissionsByStatusForAdminQueryParams,
  paginatedSrkTaskActionsByPlatformResponseSchema,
  getSrkTaskActionsByPlatformsQueryParams,
} from './schema';

import { paginatedSrkTaskEarningRequestsByUserSchema } from './schema';

import { initContract } from '@ts-rest/core';
import {
  acceptSrkTaskUserEarningsPayoutSchema,
  getSrkTaskEarningRequestsByAdminQueryParams,
  getSrkTaskUserAnalyticsSchema,
  getSrkTaskUserEarningsLeaderboardQueryParams,
  getSrkTaskUserProfileSchema,
  paginatedSrkTaskEarningRequestsByAdminSchema,
  paginatedSrkTaskUserEarningsLeaderboardSchema,
  rejectSrkTaskUserEarningsPayoutSchema,
  srkTaskActionSubmissionBodySchema,
  submitTaskOnboardingVerificationSchema,
} from './schema';
import {
  commonPaginatedQueryParamsSchema,
  ErrorSchema,
  SuccessSchema,
} from '../../common';
import z from 'zod';

const c = initContract();

export const srkTaskContract = c.router({
  getSrkTaskUserProfile: {
    method: 'GET',
    path: '/task/srk-task-user-profile/:userId',
    responses: {
      200: getSrkTaskUserProfileSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get SRK Task User Profile details by Id',
  },

  getSrkTaskUserAnalystics: {
    method: 'GET',
    path: '/task/srk-task-user-analytics/:userId',
    responses: {
      200: getSrkTaskUserAnalyticsSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get SRK Task User Analytics details by Id',
  },

  getAllSrkTaskUserEarningsLeaderboard: {
    method: 'GET',
    path: '/task/srk-task-user-earnings-leaderboard',
    query: getSrkTaskUserEarningsLeaderboardQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskUserEarningsLeaderboardSchema,
      500: ErrorSchema,
    },
    summary: 'Get all srk task user earnings Leaderboard',
  },

  srkTaskEarningsPayoutRequest: {
    method: 'POST',
    path: '/task/srk-task-user-earnings-payout-request',
    body: z.object({
      srkTaskUserId: z.string(),
      coins: z
        .number()
        .min(500, 'Coins must be at least 500')
        .max(1000, 'Coins must be at most 1000'),
    }),
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a payout request for srk task user earnings',
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
  getAllSrkTaskEarningPayoutsByAdmin: {
    method: 'GET',
    path: '/task/admin/srk-task-earning-payouts',
    query: getSrkTaskEarningRequestsByAdminQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskEarningRequestsByAdminSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all srk task user earnings Payouts for admin',
  },
  getSrkTaskUserEarningsPayoutsByUser: {
    method: 'GET',
    path: '/task/user/:userId/srk-task-earning-payouts',
    query: getSrkTaskEarningRequestsByAdminQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskEarningRequestsByUserSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get srk task user earnings Payouts by user',
  },
  getAllSrkTasksActionSubmissionByStatusForAdmin: {
    method: 'GET',
    path: '/task/admin/srk-task-action-submissions',
    query: getSrkTaskActionSubmissionsByStatusForAdminQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskActionSubmissionsByStatusForAdminSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Get all srk task action submissions by status for admin (paginated)',
  },
  getSrkTaskActionsByPlatforms: {
    method: 'GET',
    path: '/task/srk-task-actions-by-platforms',
    query: getSrkTaskActionsByPlatformsQueryParams,
    responses: {
      200: paginatedSrkTaskActionsByPlatformResponseSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get srk task actions grouped by platforms',
  },
  submitSrkTaskOnboardingVerification: {
    method: 'POST',
    path: '/task/submit-onboarding-verification/:srkUniversityId',
    body: submitTaskOnboardingVerificationSchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Submit onboarding verification for srk task user',
  },
  rejectSrkTaskOnboardingVerificationByAdmin: {
    method: 'POST',
    path: '/task/reject-onboarding-verification/:srkTaskUserId',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject onboarding verification for srk task user by admin',
  },
  approveSrkTaskOnboardingVerificationByAdmin: {
    method: 'POST',
    path: '/task/approve-onboarding-verification/:srkTaskUserId',
    body: z.object({}),
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve onboarding verification for srk task user by admin',
  },
  srkTaskActionSubmission: {
    method: 'POST',
    path: '/task/srk-task-action-submission',
    body: srkTaskActionSubmissionBodySchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Submit an action for srk task user',
  },
  rejectSrkTaskActionByAdmin: {
    method: 'POST',
    path: '/task/srk-task-action-rejection/:submissionId',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject an action submission for srk task user by admin',
  },
  approveSrkTaskActionByAdmin: {
    method: 'POST',
    path: '/task/srk-task-action-approval/:submissionId',
    body: z.object({}),
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve an action submission for srk task user by admin',
  },
});
