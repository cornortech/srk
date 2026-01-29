import { initContract } from '@ts-rest/core';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  createBankDetailsSchema,
  getBankDetailsSchema,
  paymentIntentReponseSchema,
} from './schema';
import { z } from 'zod';

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
  updateBankDetails: {
    method: 'PUT',
    path: '/bank/details/:userId',
    description: 'Update bank details for a user',
    summary: 'Update Bank Details',
    body: createBankDetailsSchema,
    responses: {
      200: SuccessSchema,
      404: ErrorSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
  },
  getBankDetailsByUserId: {
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
  getBankBalance: {
    method: 'GET',
    path: '/bank/balance/:userId',
    description: 'Get bank balance for a user',
    summary: 'Get Bank Balance',
    responses: {
      200: z.object({
        balance: z.number(),
      }),
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  getBankDetailsByAccountNumber: {
    method: 'GET',
    path: '/bank/:accountNumber',
    description: 'Get bank details by account number',
    summary: 'Get Bank Details by Account Number',
    responses: {
      200: getBankDetailsSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  createBankTransactionPin: {
    method: 'POST',
    path: '/bank/create-transaction-pin/:userId',
    description: 'Create transaction PIN for a user',
    summary: 'Create Transaction PIN',
    body: z.object({
      transactionPIN: z.string().length(4),
    }),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  sendMoney: {
    method: 'POST',
    path: '/bank/send-money/:userId',
    description: 'Send money to another user',
    summary: 'Send Money',
    body: z.object({
      intentId: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },

  validateTransactionPIN: {
    method: 'POST',
    path: '/bank/validate-transaction-pin',
    description: 'Validate transaction PIN for a user',
    summary: 'Validate Transaction PIN',
    body: z.object({
      intentId: z.string(),
      transactionPIN: z.string().length(4),
    }),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  sendBankRegistrationOtp: {
    method: 'POST',
    path: '/bank/send-registration-otp/:userId',
    description: 'Send OTP for bank registration',
    summary: 'Send Bank Registration OTP',
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  validateBankRegistrationOtp: {
    method: 'POST',
    path: '/bank/validate-registration-otp/:userId',
    description: 'Validate OTP for bank registration',
    summary: 'Validate Bank Registration OTP',
    body: z.object({
      otp: z.string().length(6),
    }),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  uploadBankProfilePicture: {
    method: 'POST',
    path: '/bank/upload-profile-picture/:userId',
    description: 'Upload profile picture for bank account',
    summary: 'Upload Bank Profile Picture',
    body: z.object({
      profilePicture: z.string().min(2).max(1000),
    }),
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
  paymentIntent: {
    method: 'POST',
    path: '/bank/payment-intent/:userId',
    summary: 'Create Payment Intent',
    body: z.object({
      recipientName: z.string().min(2).max(100),
      amount: z.number().min(500).max(10000),
      receiverAccountNumber: z.string().length(16),
      description: z.string().max(100).optional(),
    }),
    responses: {
      200: paymentIntentReponseSchema,
      400: ErrorSchema,
      401: ErrorSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
  },
});
