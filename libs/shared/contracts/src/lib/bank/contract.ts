import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ErrorSchema, SuccessSchema } from '../common';
import { createBankDetailsSchema, getBankDetailsSchema, getSrkBankRequestByStatusSchema } from './schema';

const c = initContract();

export const bankContract = c.router({
  createBankDetails: {
    method: 'POST',
    path: '/bank/create',
    body: createBankDetailsSchema,
    responses: {
      201: SuccessSchema,
      400: ErrorSchema,
      403: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create bank details for a user',
  },
  getBankDetailsById: {
    method: 'GET',
    path: '/bank/:id',
    responses: {
      200: getBankDetailsSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get bank details by ID',
  },
  getBankDetailsByUser: {
    method: 'GET',
    path: '/bank/user/:userId',
    responses: {
      200: getBankDetailsSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get bank details by user ID',
  },
  updateBankDetails: {
    method: 'PUT',
    path: '/bank/:id',
    body: createBankDetailsSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Update bank details by ID',
  },
  deleteBankDetails: {
    method: 'DELETE',
    path: '/bank/:id',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Delete bank details by ID',
  },
  getSrkBankRequestByStatus: {
    method: 'GET',
    path: '/bank/srk/requests',
    query: getSrkBankRequestByStatusSchema,
    responses: {
      200: z.array(getBankDetailsSchema),
      403: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get SRK bank requests by status',
  },
});
