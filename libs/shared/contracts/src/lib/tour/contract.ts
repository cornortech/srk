import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ErrorSchema, SuccessSchema } from '../common';
import { getUserTourSchema, getTourTargetSchema, createTourProgressSchema } from './schema';

const c = initContract();

export const tourContract = c.router({
  getUserTourProgress: {
    method: 'GET',
    path: '/tour/user/progress',
    responses: {
      200: z.array(getUserTourSchema),
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get tour progress for current user',
  },
  getTourTargets: {
    method: 'GET',
    path: '/tour/targets',
    responses: {
      200: z.array(getTourTargetSchema),
      403: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all tour targets',
  },
  markTourComplete: {
    method: 'POST',
    path: '/tour/complete',
    body: createTourProgressSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      403: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Mark a tour as complete',
  },
  resetTourProgress: {
    method: 'POST',
    path: '/tour/reset',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Reset tour progress for current user',
  },
});
