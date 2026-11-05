import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  contentLeadersSchema,
  contentSubmissionStatusSchema,
  getContentSubmissionsQuerySchema,
  paginatedContentSubmissionsSchema,
  selectContentLeaderSchema,
  setContentPermissionSchema,
  submitContentSchema,
} from './schema';

const c = initContract();

export const contentRewardContract = c.router({
  // ---- user ----
  getContentSubmissionStatus: {
    method: 'GET',
    path: '/content-reward/user/status',
    responses: {
      200: contentSubmissionStatusSchema,
      401: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Upload permission and submission window state for the user',
  },
  submitContent: {
    method: 'POST',
    path: '/content-reward/user/submit',
    body: submitContentSchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      403: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Submit content links (one submission per day, inside the window)',
  },
  getContentLeaderboard: {
    method: 'GET',
    path: '/content-reward/user/leaderboard',
    responses: { 200: contentLeadersSchema, 500: ErrorSchema },
    summary: 'Weekly content reward leaders',
  },

  // ---- admin ----
  getContentSubmissionsForAdmin: {
    method: 'GET',
    path: '/content-reward/admin/submissions',
    query: getContentSubmissionsQuerySchema.optional(),
    responses: { 200: paginatedContentSubmissionsSchema, 500: ErrorSchema },
    summary: 'Content submissions, filterable by date range (admin)',
  },
  selectContentLeader: {
    method: 'POST',
    path: '/content-reward/admin/leaders',
    body: selectContentLeaderSchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Select a submission as a weekly leader with a rank (admin)',
  },
  getContentLeadersForAdmin: {
    method: 'GET',
    path: '/content-reward/admin/leaders',
    responses: { 200: contentLeadersSchema, 500: ErrorSchema },
    summary: 'All selected leaders (admin)',
  },
  removeContentLeader: {
    method: 'DELETE',
    path: '/content-reward/admin/leaders/:leaderId',
    body: z.object({}),
    responses: { 200: SuccessSchema, 404: ErrorSchema, 500: ErrorSchema },
    summary: 'Remove a leader selection (admin)',
  },
  setContentUploadPermission: {
    method: 'POST',
    path: '/content-reward/admin/users/:userId/permission',
    body: setContentPermissionSchema,
    responses: { 200: SuccessSchema, 404: ErrorSchema, 500: ErrorSchema },
    summary: 'Allow or disallow a user to upload content (admin)',
  },
});
