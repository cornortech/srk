import { z } from 'zod';
import {
  commonPaginatedQueryParamsSchema,
  commonPaginationResponse,
} from '../common';

export const createRewardSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  photoUrl: z.string().min(1, 'Photo is required'),
  requiredEarning: z.number().min(1, 'Earning must be at least 1'),
});

export const rewardSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  photoUrl: z.string(),
  requiredEarning: z.number(),
  isActive: z.boolean(),
  claimCount: z.number(),
  createdAt: z.string(),
});

export const paginatedRewardsSchema = commonPaginationResponse.extend({
  data: z.array(rewardSchema),
});

export const userRewardSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  photoUrl: z.string(),
  requiredEarning: z.number(),
  createdAt: z.string(),
  // false when the user registered before the reward was created
  isEligible: z.boolean(),
  currentEarning: z.number(),
  isCompleted: z.boolean(),
  isClaimed: z.boolean(),
  claimedAt: z.string().optional(),
});

export const userRewardsSchema = z.array(userRewardSchema);

export const rewardClaimSchema = z.object({
  _id: z.string(),
  rewardTitle: z.string(),
  requiredEarning: z.number(),
  earningAtClaim: z.number(),
  user: z.object({
    _id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
  }),
  claimedAt: z.string(),
});

export const paginatedRewardClaimsSchema = commonPaginationResponse.extend({
  data: z.array(rewardClaimSchema),
});

export const rewardPageQuerySchema = commonPaginatedQueryParamsSchema;
