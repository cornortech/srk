import { initContract } from '@ts-rest/core';
import { ErrorSchema, SuccessSchema } from '../common';
import { z } from 'zod';
import {
  getAllAffiliateRequestsByStatusSchema,
  getTeamsOfUserSchema,
} from './schema';

const c = initContract();

export const affiliateContract = c.router({
  affiliateRequest: {
    method: 'POST',
    path: '/affiliate/request/:userId',
    body: z.object({}).optional(),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a new course',
  },
  addAffiliateBiometricData: {
    method: 'POST',
    path: '/affiliate/addAffiliateBiometricData/:userId',
    body: z.object({
      verificationImage: z.string(),
      leftThumbPrint: z.string(),
      rightThumbPrint: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a new course',
  },
  approveAffiliateRequest: {
    method: 'POST',
    path: '/affiliate/approve/:userId',
    body: z.object({}).optional(),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve affiliate request by admin',
  },
  rejectAffiliateRequest: {
    method: 'POST',
    path: '/affiliate/reject/:userId',
    body: z.object({
      reason: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Approve affiliate request by admin',
  },
  getAllAffiliateRequestsByStatus: {
    method: 'GET',
    path: '/affiliate/getAllAffiliateRequestsByStatus',
    query: z.object({
      status: z.array(z.string()).optional(),
      limit: z.string().optional(),
      page: z.string().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllAffiliateRequestsByStatusSchema,
        page: z.number(),
        limit: z.number(),
        totalUsers: z.number(),
        totalPages: z.number(),
      }),
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all affiliate requests by status',
  },
  getTeamsOfUser: {
    method: 'GET',
    path: '/affiliate/getTeamsOfUser/:userId',
    responses: {
      200: getTeamsOfUserSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get teams of user',
  },
});
