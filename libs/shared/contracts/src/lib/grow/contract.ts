import { initContract } from '@ts-rest/core';
import {
  createGrowSocialMediaEnrollmentSchema,
  getAllSrkGrowUsersResponseSchema,
  getAllSrkGrowUsersQueryParams,
  getAllGrowSocialMediaEnrollmentSchema,
  getGrowSocialMediaEnrollmentByIdSchema,
  validateGrowUserPromoCodeResponseSchema,
  validateGrowUserPromoCodeSchema,
  getSrkGrowProfileResponseSchema,
  createGrowSocialMediaTasksSchema,
  srkGrowAffiliateVerificationSchema,
  getAllSrkGrowAffiliateVerificationQueryParams,
  paginatedGetAllSrkGrowAffiliateVerificationSchema,
  createGrowSrkAffiliateEarningPayoutRequestSchema,
  acceptGrowSrkAffiliateEarningPayoutRequestSchema,
  rejectGrowSrkAffiliateEarningPayoutRequestSchema,
  paginatedGrowSrkAffiliateEarningPayoutsSchema,
  getSrkGrowAffiliateEarningPayoutQueryParamsSchema,
  taskMonitoringResponseSchema,
  toggleEnrollmentActiveStatusSchema,
  globalOverviewResponseSchema,
  globalOverviewQuerySchema,
  resubmitGrowVerificationSchema,
} from './schema';
import { ErrorSchema, SuccessSchema } from '../common';
import { z } from 'zod';

const GrowAffiliateApprovedResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  verificationRequests: z.array(z.any()),
  relatedUserData: z.array(z.any()),
});

const c = initContract();

export const growContract = c.router({
  getAllGrowSocialMediaEnrollement: {
    method: 'GET',
    path: '/get-all-social-media-enrollement',
    query: z
      .object({
        limit: z.coerce.number().optional(),
        page: z.coerce.number().optional(),
      })
      .optional(),
    responses: {
      200: z.object({
        data: getAllGrowSocialMediaEnrollmentSchema,
        page: z.number(),
        limit: z.number(),
        totalUsers: z.number(),
        totalPages: z.number(),
      }),
      400: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Get all grow social media enrollement for user with user details and payment details',
  },

  getGrowSocialMediaEnrollmentById: {
    method: 'GET',
    path: '/get-social-media-enrollment-by-id/:enrollmentID',
    responses: {
      200: getGrowSocialMediaEnrollmentByIdSchema,
      400: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Get grow social media enrollment for user by ID with user details and payment details',
  },

  getAllSrkGrowUsers: {
    method: 'GET',
    path: '/grow-users',
    query: getAllSrkGrowUsersQueryParams,
    responses: {
      200: getAllSrkGrowUsersResponseSchema,
      500: ErrorSchema,
    },
    summary: 'Get all srk grow users who is registered',
  },

  getSrkGrowProfile: {
    method: 'GET',
    path: '/get-srk-grow-profile/:userId',
    pathParams: z.object({
      userId: z.string(),
    }),
    responses: {
      200: getSrkGrowProfileResponseSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get Srk Grow Profile by Id',
  },

  createGrowSocialMediaEnrollment: {
    method: 'POST',
    path: '/social-media-enrollment',
    body: createGrowSocialMediaEnrollmentSchema,
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
        enrollmentId: z.string(),
      }),
      400: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Create a new grow social media enrollment for user with user details and payment details',
  },

  validateGrowUserPromoCode: {
    method: 'POST',
    path: '/validate-promo-code',
    body: validateGrowUserPromoCodeSchema,
    responses: {
      200: validateGrowUserPromoCodeResponseSchema,
      400: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Validate enetered promo code and return its details with discount',
  },

  acceptSocialGrowEnrollmentRequest: {
    method: 'PUT',
    path: '/grow/accept-social-grow-enrollment-request/:enrollmentId',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve Social Grow enrollment Request by Id',
  },

  rejectSocialGrowEnrollmentRequest: {
    method: 'PUT',
    path: '/grow/reject-social-grow-enrollment-request/:enrollmentId',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject Social Grow Enrollment Request by Id',
  },

  resubmitGrowVerification: {
    method: 'PUT',
    path: '/resubmit-verification',
    body: resubmitGrowVerificationSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Resubmit verification with new KYC and payment details',
  },

  createGrowSocialMediaTasks: {
    method: 'POST',
    path: '/grow/social-media-tasks',
    body: createGrowSocialMediaTasksSchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create grow social media tasks urls',
  },

  srkGrowAffiliateVerificationRequest: {
    method: 'POST',
    path: '/grow/affiliate/verification-request',
    body: srkGrowAffiliateVerificationSchema,
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'SRK Grow Affiliate Verification Request',
  },

  getAllSrkGrowAffiliateVerificationRequest: {
    method: 'GET',
    path: '/grow/affiliate/get-all-verification-request',
    query: getAllSrkGrowAffiliateVerificationQueryParams.optional(),
    responses: {
      200: paginatedGetAllSrkGrowAffiliateVerificationSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get All SRK Grow Affiliate Verification Request',
  },

  approveSrkGrowAffiliateVerificationRequest: {
    method: 'POST',
    path: '/grow/affiliate/approve-verification-follow-request/:srkGrowaffiliateVerificationId',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve SRK Grow Verification Follow Request by Id',
  },

  rejectSrkGrowAffiliateVerificationRequest: {
    method: 'POST',
    path: '/grow/affiliate/reject-verification-follow-request/:srkGrowaffiliateVerificationId',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject SRK Grow Verification Follow Request By Id',
  },

  // Affiliate Earning Payout Endpoints
  createGrowSrkAffiliateEarningPayoutRequest: {
    method: 'POST',
    path: '/grow/affiliate/earning/payout/request',
    body: createGrowSrkAffiliateEarningPayoutRequestSchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create SRK Grow Affiliate Earning Payout Request',
  },

  acceptGrowSrkAffiliateEarningPayoutRequestByAdmin: {
    method: 'POST',
    path: '/grow/affiliate/earning/payout/request/:id/accept',
    pathParams: z.object({
      id: z.string(),
    }),
    body: acceptGrowSrkAffiliateEarningPayoutRequestSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Accept SRK Grow Affiliate Earning Payout Request By Admin',
  },

  rejectGrowSrkAffiliateEarningPayoutRequestByAdmin: {
    method: 'POST',
    path: '/grow/affiliate/earning/payout/request/:id/reject',
    pathParams: z.object({
      id: z.string(),
    }),
    body: rejectGrowSrkAffiliateEarningPayoutRequestSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject SRK Grow Affiliate Earning Payout Request By Admin',
  },

  getSrkGrowAffiliateEarningPayoutRequestByAdmin: {
    method: 'GET',
    path: '/grow/affiliate/earning/payout/request/admin',
    query: getSrkGrowAffiliateEarningPayoutQueryParamsSchema,
    responses: {
      200: paginatedGrowSrkAffiliateEarningPayoutsSchema,
      403: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get SRK Grow Affiliate Earning Payout Requests By Admin',
  },

  getSrkGrowAffiliateEarningPayoutRequestByUser: {
    method: 'GET',
    path: '/grow/affiliate/earning/payout/request/user/:userId',
    pathParams: z.object({
      userId: z.string(),
    }),
    query: getSrkGrowAffiliateEarningPayoutQueryParamsSchema.omit({
      status: true,
    }),
    responses: {
      200: paginatedGrowSrkAffiliateEarningPayoutsSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get approved SRK Grow Affiliate Verification Request for a user',
  },
  getApprovedSrkGrowAffiliateVerificationRequest: {
    method: 'GET',
    path: '/grow/affiliate/get-approved-verification-request',
    query: z.object({
      srkUniversityUserId: z.string(), // required
    }),
    responses: {
      200: GrowAffiliateApprovedResponseSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get approved SRK Grow Affiliate Verification Request for a user',
  },

  getTaskMonitoring: {
    method: 'GET',
    path: '/grow/task-monitoring',
    query: z
      .object({
        search: z.string().optional(),
      })
      .optional(),
    responses: {
      200: taskMonitoringResponseSchema,
      500: ErrorSchema,
    },
    summary: 'Get task monitoring analytics for all grow package users',
  },

  toggleEnrollmentActiveStatus: {
    method: 'PATCH',
    path: '/grow/toggle-enrollment-active/:enrollmentId',
    pathParams: z.object({
      enrollmentId: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
        isActive: z.boolean(),
      }),
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Toggle enrollment active status (timeout)',
  },

  getGlobalOverview: {
    method: 'GET',
    path: '/grow/global-overview',
    query: globalOverviewQuerySchema,
    responses: {
      200: globalOverviewResponseSchema,
      500: ErrorSchema,
    },
    summary: 'Get global overview dashboard statistics',
  },
});
