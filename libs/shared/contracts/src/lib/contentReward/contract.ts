import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  contentLeadersSchema,
  contentRewardStatementSchema,
  contentSubmissionStatusSchema,
  adminSubmissionWeeksSchema,
  getContentSubmissionsQuerySchema,
  getSubmissionsByWeekQuerySchema,
  userSubmissionWeeksSchema,
  paginatedContentSubmissionsSchema,
  selectContentLeaderSchema,
  setContentLeaderImageSchema,
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

  getContentRewardStatement: {
    method: 'GET',
    path: '/content-reward/user/statement',
    responses: {
      200: contentRewardStatementSchema,
      401: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "The user's earnings received from content rewards",
  },

  getMyContentSubmissions: {
    method: 'GET',
    path: '/content-reward/user/submissions',
    responses: { 200: userSubmissionWeeksSchema, 401: ErrorSchema, 500: ErrorSchema },
    summary: "The user's own submissions grouped by week, with each week's result",
  },

  // ---- admin ----
  getContentSubmissionsByWeek: {
    method: 'GET',
    path: '/content-reward/admin/submissions-by-week',
    query: getSubmissionsByWeekQuerySchema.optional(),
    responses: { 200: adminSubmissionWeeksSchema, 500: ErrorSchema },
    summary: 'Submissions grouped by week, then by user (admin)',
  },
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
  setContentLeaderImage: {
    method: 'PUT',
    path: '/content-reward/admin/leaders/:leaderId/image',
    body: setContentLeaderImageSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Add or replace the post image of a selected leader (admin)',
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
