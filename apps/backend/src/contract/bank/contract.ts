import { initContract } from '@ts-rest/core';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  createBankDetailsSchema,
  getBankDetailsSchema,
  getSrkBankRequestByStatusSchema,
} from './schema';

const c = initContract();

export const bankContract = c.router({
  createBankDetails: {
    method: 'POST',
    path: '/bank/details/:userId',
    description: 'Create bank details for a user',
    summary: 'Create Bank Details',
    body: createBankDetailsSchema,
    responses: {
      200: SuccessSchema,
      404: ErrorSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
  },
  getBankDetails: {
    method: 'GET',
    path: '/bank/details/:userId',
    description: 'Get bank details for a user',
    summary: 'Get Bank Details',
    responses: {
      200: getBankDetailsSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  getSrkBankRequestByStatus: {
    method: 'GET',
    path: '/bank/srk-requests',
    description: 'Get SRK bank requests by status',
    summary: 'Get SRK Bank Requests By Status',
    responses: {
      200: getSrkBankRequestByStatusSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
});
