import { initContract } from '@ts-rest/core';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  createSocialLinkSchema,
  createSocialTaskFollowRequestSchema,
  createSocialTaskPackageEnrollmentSchema,
  createSocialTaskPackageSchema,
  createSrkTaskUserVerificationSchema,
} from './schema';
import z from 'zod';

const c = initContract();

export const taskContract = c.router({
  createSocialTaskPackage: {
    method: 'POST',
    path: '/task/social-task-package',
    body: createSocialTaskPackageSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a New Package',
  },

  getSocialTaskPackages: {
    method: 'GET',
    path: '/task/social-task-packages',
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get Social Task Packages',
  },

  enrollSocialTaskPackage: {
    method: 'POST',
    path: '/task/social-task-package/enroll',
    body: createSocialTaskPackageEnrollmentSchema,
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Enroll in Social Task Package',
  },

  getAllSocialTaskEnrollments: {
    method: 'GET',
    path: '/task/social-task-enrollements-by-status',
    query: z.object({
      status: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get All Social Task Enrollments by Status',
  },

  acceptTaskEnrollmentRequest: {
    method: 'PATCH',
    path: '/task/accept-social-task-enrollement-request/:id',
    body: z.object({}), // no fields required
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Accept Social Task Enrollment by Id',
  },

  rejectTaskEnrollmentRequest: {
    method: 'PATCH',
    path: '/task/reject-social-task-enrollment-request/:id',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject Social Task Enrollment by Id',
  },

  createSocialLinks: {
    method: 'POST',
    path: '/task/create-social-links',
    body: createSocialLinkSchema,
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create Social Links',
  },

  getAllActiveSocialLinksToFollow: {
    method: 'GET',
    path: '/task/get-all-active-social-links-to-follow',
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get All Active Social Links to Follow',
  },

  createSocialTaskFollowRequest: {
    method: 'POST',
    path: '/task/create-social-task-follow-request/:id',
    body: createSocialTaskFollowRequestSchema,
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create Social Task Follow Request',
  },

  approveSocialTaskFollowRequest: {
    method: 'PATCH',
    path: '/task/approve-social-task-follow-request/:id',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve Social Task Follow Request by Id',
  },

  rejectSocialTaskFollowRequest: {
    method: 'PATCH',
    path: '/task/reject-social-task-follow-request/:id',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject Social Task Follow Request by Id',
  },

  getSocialTaskEarning: {
    method: 'GET',
    path: '/task/get-social-task-earning/:id',
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get Social Task Earning by Id',
  },

  submitSrkTaskUserVerification: {
    method: 'POST',
    path: '/task/srk-task-user-verification',
    body: createSrkTaskUserVerificationSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Submit SRK Task User Verification',
  },

  acceptSrkTaskUserVerification: {
    method: 'PATCH',
    path: '/task/accept-srk-task-user-verification/:id',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Accept SRK Task User Verification by Id',
  },

  rejectSrkTaskUserVerification: {
    method: 'PATCH',
    path: '/task/reject-srk-task-user-verification/:id',
    body: z.object({
      rejectionReason: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reject SRK Task User Verification by Id',
  },
});
