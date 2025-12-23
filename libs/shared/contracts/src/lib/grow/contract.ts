import { initContract } from '@ts-rest/core';
import {
  createGrowSocialMediaEnrollementSchema,
  getAllGrowSocialMediaEnrollementSchema,
  getGrowSocialMediaEnrollementByIdSchema,
  validateGrowUserPromoCodeResponseSchema,
  validateGrowUserPromoCodeSchema,
  srkGrowAffiliateVerificationSchema,
  getAllSrkGrowAffiliateVerificationRequestSchema,
  paginatedGetAllSrkGrowAffiliateVerificationSchema,
  getAllSrkGrowAffiliateVerificationQueryParams,
} from './schema';
import {
  ErrorSchema,
  SuccessSchema,
} from '../common';
import { z } from 'zod';

const c = initContract();

export const growContract = c.router({
  createGrowSocialMediaEnrollement: {
    method: 'POST',
    path: '/social-media-enrollement',
    body: createGrowSocialMediaEnrollementSchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Create a new grow social media enrollement for user with user details and payment details',
  },
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
        data: getAllGrowSocialMediaEnrollementSchema,
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
  getGrowSocialMediaEnrollementById: {
    method: 'GET',
    path: '/get-social-media-enrollement-by-id/:enrollmentID',
    responses: {
      200: getGrowSocialMediaEnrollementByIdSchema,
      400: ErrorSchema,
      409: ErrorSchema,
      500: ErrorSchema,
    },
    summary:
      'Get grow social media enrollement for user by ID with user details and payment details',
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
    path: '/grow/accept-social-grow-enrollement-request/:enrollementId',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve Social Grow Enrollement Request by Id',
  },

  rejectSocialGrowEnrollmentRequest: {
    method: 'PUT',
    path: '/grow/reject-social-grow-enrollement-request/:enrollementId',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject Social Grow Enrollement Request by Id',
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
    query:getAllSrkGrowAffiliateVerificationQueryParams.optional(),
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
