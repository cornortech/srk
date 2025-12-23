import { initContract } from '@ts-rest/core';
import {
  checkPromocodeOfUserSchema,
  getAllUsersSchema,
  getReferralTeamSchema,
  getUserDetailsSchema,
  updateUserDetailsSchema,
} from './schema';
import { ErrorSchema, SuccessSchema } from '../common';
import { z } from 'zod';

const c = initContract();

export const userContract = c.router({
  getUserDetails: {
    method: 'GET',
    path: '/user/getUserDetails/:userId',
    responses: {
      200: getUserDetailsSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get user details by user ID',
  },
  updatePassword: {
    method: 'PUT',
    path: '/user/updatePassword/:userId',
    body: z.object({
      password: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Update password by user ID',
  },
  updateUserDetails: {
    method: 'PUT',
    path: '/user/updateUserDetails/:userId',
    body: updateUserDetailsSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Update user details by user ID',
  },
  getRefferedUsersByUserId: {
    method: 'GET',
    path: '/user/getRefferedUsersByUserId/:userId',
    responses: {
      200: getReferralTeamSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get reffered users by user ID',
  },
  verifyPromocode: {
    method: 'GET',
    path: '/user/verifyPromocode/:promocode',
    responses: {
      200: checkPromocodeOfUserSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Check promocode of user',
  },
  getAllUsers: {
    method: 'GET',
    path: '/user/getAllUsers',
    query: z
      .object({
        limit: z.string().optional(),
        page: z.string().optional(),
        status: z
          .array(
            z.enum([
              'REGISTERED',
              'PAYMENT_VERIFICATION_REJECTED',
              'PAYMENT_VERIFICATION_PENDING',
              'KYC_VERIFICATION_PENDING',
              'KYC_VERIFICATION_REJECTED',
              'PORTAL_ACTIVATED',
              'PORTAL_DEACTIVATED',
            ])
          )
          .optional(),
      })
      ?.optional(),
    responses: {
      200: getAllUsersSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all users',
  },
});
