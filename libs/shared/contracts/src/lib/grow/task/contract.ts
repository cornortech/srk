import { initContract } from '@ts-rest/core';
import {
  acceptSrkTaskUserEarningsPayoutSchema,
  getSrkTaskUserAnalyticsSchema,
  getSrkTaskUserEarningsLeaderboardQueryParams,
  getSrkTaskUserProfileSchema,
  paginatedSrkTaskUserEarningsLeaderboardSchema,
  rejectSrkTaskUserEarningsPayoutSchema,
  srkTaskActionSubmissionBodySchema,
  submitTaskOnboardingVerificationSchema,
} from './schema';
import { ErrorSchema, SuccessSchema } from '../../common';
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
