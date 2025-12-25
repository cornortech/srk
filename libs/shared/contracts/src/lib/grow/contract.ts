import { initContract } from '@ts-rest/core';
import {
  createGrowSocialMediaEnrollmentSchema,
  getAllSrkGrowUsersResponseSchema,
  getAllGrowSocialMediaEnrollmentSchema,
  getGrowSocialMediaEnrollmentByIdSchema,
  validateGrowUserPromoCodeResponseSchema,
  validateGrowUserPromoCodeSchema,
  getSrkGrowProfileResponseSchema,
  createGrowSocialMediaTasksSchema,
  srkGrowAffiliateVerificationSchema,
  getAllSrkGrowAffiliateVerificationQueryParams,
  paginatedGetAllSrkGrowAffiliateVerificationSchema,
} from './schema';
import { ErrorSchema, SuccessSchema } from '../common';
import { z } from 'zod';

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
      ?.optional(),
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
      201: SuccessSchema,
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
    body: z.object({
      userId: z.string(),
      kycURLs: z.array(z.string()),
      transactionId: z.string(),
      paymentURL: z.string(),
    }),
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
});
