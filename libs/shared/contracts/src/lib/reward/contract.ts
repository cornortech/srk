import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  createRewardSchema,
  paginatedRewardClaimsSchema,
  paginatedRewardsSchema,
  rewardPageQuerySchema,
  userRewardsSchema,
} from './schema';

const c = initContract();

export const rewardContract = c.router({
  createReward: {
    method: 'POST',
    path: '/reward/admin',
    body: createRewardSchema,
    responses: { 201: SuccessSchema, 400: ErrorSchema, 500: ErrorSchema },
    summary: 'Create a reward (admin)',
  },
  getAllRewards: {
    method: 'GET',
    path: '/reward/admin',
    query: rewardPageQuerySchema.optional(),
    responses: { 200: paginatedRewardsSchema, 500: ErrorSchema },
    summary: 'Get all rewards with claim counts (admin)',
  },
  toggleRewardActive: {
    method: 'POST',
    path: '/reward/admin/:rewardId/toggle-active',
    body: z.object({}),
    responses: { 200: SuccessSchema, 404: ErrorSchema, 500: ErrorSchema },
    summary: 'Enable or disable a reward (admin)',
  },
  getRewardClaims: {
    method: 'GET',
    path: '/reward/admin/claims',
    query: rewardPageQuerySchema.optional(),
    responses: { 200: paginatedRewardClaimsSchema, 500: ErrorSchema },
    summary: 'Users who claimed rewards, with contact details (admin)',
  },
  getMyRewards: {
    method: 'GET',
    path: '/reward/my',
    responses: { 200: userRewardsSchema, 401: ErrorSchema, 500: ErrorSchema },
    summary: 'Rewards with progress for the logged-in user',
  },
  claimReward: {
    method: 'POST',
    path: '/reward/my/:rewardId/claim',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Claim a completed reward',
  },
});
