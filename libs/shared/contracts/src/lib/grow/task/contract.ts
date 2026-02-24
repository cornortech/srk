import {
  paginatedSrkTaskActionSubmissionsByStatusForAdminSchema,
  getSrkTaskActionSubmissionsByStatusForAdminQueryParams,
  paginatedSrkTaskActionsByPlatformResponseSchema,
  getSrkTaskActionsByPlatformsQueryParams,
  getSrkTaskActionSubmissionByStatusByUserQueryParams,
  paginatedSrkTaskActionSubmissionsByUserSchema,
  paginatedSrkTaskUserFinanceStatementSchema,
  getAllSrkTaskUserFinanceStatementQueryParams,
  getAllTaskAffiliateResponseSchema,
  paginatedSrkTaskOnboardingVerificationRequestSchema,
  getSrkTaskOnboardingVerificationRequestQueryParams,
  paginatedSrkTaskUsersForAdminSchema,
  getAllSrkTaskUsersForAdminQueryParams,
  paginatedCompletedSrkTaskSubmissionsSchema,
  getAllCompletedSrkTaskSubmissionsQueryParams,
  getRejectedSrkTaskActionSubmissionsByUserQueryParams,
  paginatedRejectedSrkTaskActionSubmissionsByUserSchema,
  getUserPaymentDetailsResponseSchema,
  submitSrkTaskPaymentDetailsRequestSchema,
  paginatedSrkTaskPaymentDetailsRequestsSchema,
  getSrkTaskPaymentDetailsRequestsQueryParams,
  reviewSrkTaskPaymentDetailsRequestSchema,
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

  getSrkTaskUserAnalytics: {
    method: 'GET',
    path: '/task/srk-task-user-analytics/:userId',
    responses: {
      200: getSrkTaskUserAnalyticsSchema,
      400: ErrorSchema,
      404: ErrorSchema,
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

  getSrkTaskOnboardingVerificationRequestForAdmin: {
    method: 'GET',
    path: '/task/admin/srk-task-onboarding-verification-requests',
    query: getSrkTaskOnboardingVerificationRequestQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskOnboardingVerificationRequestSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Get all srk task onboarding verification requests for admin (paginated)',
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
  getSrkTaskUserEarningsPayoutsByUser: {
    method: 'GET',
    path: '/task/user/:userId/srk-task-earning-payouts',
    query: getSrkTaskEarningRequestsByAdminQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskEarningRequestsByUserSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get srk task user earnings Payouts by user.',
  },
  getAllSrkTasksActionSubmissionsByUser: {
    method: 'GET',
    path: '/task/user/:userId/srk-task-action-submissions',
    query: getSrkTaskActionSubmissionByStatusByUserQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskActionSubmissionsByUserSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all srk task action submissions by user (paginated)',
  },
  getRejectedSrkTaskActionSubmissionsByUser: {
    method: 'GET',
    path: '/task/user/:userId/rejected-submissions',
    query: getRejectedSrkTaskActionSubmissionsByUserQueryParams.optional(),
    responses: {
      200: paginatedRejectedSrkTaskActionSubmissionsByUserSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get rejected srk task action submissions by user (attention needed)',
  },
  getAllSrkTaskUserFinanceStatement: {
    method: 'GET',
    path: '/task/user/:userId/srk-task-finance-statement',
    query: getAllSrkTaskUserFinanceStatementQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskUserFinanceStatementSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all finance statements for a srk task user (paginated)',
  },

  getAllSrkTaskUsersForAdmin: {
    method: 'GET',
    path: '/task/admin/srk-task-users',
    query: getAllSrkTaskUsersForAdminQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskUsersForAdminSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all srk task users for admin with comprehensive details (paginated)',
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
    summary: 'Create a payout request for srk task user earnings. (withdraw)',
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
    summary: 'Accept payout request for srk task user earnings. (by admin)',
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
    summary: 'Reject payout request for srk task user earnings. (by admin)',
  },

  submitSrkTaskOnboardingVerification: {
    method: 'POST',
    path: '/task/submit-onboarding-verification/:srkUniversityId',
    body: submitTaskOnboardingVerificationSchema,
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
        taskUserID: z.string(),
      }),
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
  rejectSrkTaskActionSubmissionByAdmin: {
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
  approveSrkTaskActionSubmissionByAdmin: {
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
  getAllSrkTaskAffiliateVerificationRequest: {
    method: 'GET',
    path: '/task/affiliate/get-approved-verification-request',
    query: z.object({
      srkUniversityUserId: z.string(), // required
    }),
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
        data: getAllTaskAffiliateResponseSchema,
      }),
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get approved SRK Task Affiliate Verification Request for a user',
  },
  getAllCompletedSrkTaskSubmissionsForAdmin: {
    method: 'GET',
    path: '/task/completed-submissions-for-admin',
    query: getAllCompletedSrkTaskSubmissionsQueryParams,
    responses: {
      200: paginatedCompletedSrkTaskSubmissionsSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all completed (approved) task submissions for admin',
  },

  // Payment Details Endpoints
  getUserPaymentDetails: {
    method: 'GET',
    path: '/task/user-payment-details/:userId',
    responses: {
      200: getUserPaymentDetailsResponseSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get user payment details and pending request',
  },

  submitPaymentDetailsRequest: {
    method: 'POST',
    path: '/task/submit-payment-details-request/:userId',
    body: submitSrkTaskPaymentDetailsRequestSchema,
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Submit payment details verification request',
  },

  getAllPaymentDetailsRequestsForAdmin: {
    method: 'GET',
    path: '/task/admin/payment-details-requests',
    query: getSrkTaskPaymentDetailsRequestsQueryParams.optional(),
    responses: {
      200: paginatedSrkTaskPaymentDetailsRequestsSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all payment details requests for admin',
  },

  reviewPaymentDetailsRequest: {
    method: 'POST',
    path: '/task/admin/review-payment-details-request',
    body: reviewSrkTaskPaymentDetailsRequestSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve or reject payment details request',
  },
});
