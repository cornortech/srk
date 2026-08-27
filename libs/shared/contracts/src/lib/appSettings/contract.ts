import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  appSettingsSchema,
  updateAppSettingsSchema,
  qrCodeSchema,
  createQRCodeSchema,
  updateQRCodeSchema,
} from './schema';

const c = initContract();

export const appSettingsContract = c.router({
  getAppSettings: {
    method: 'GET',
    path: '/app-settings',
    responses: {
      200: z.object({
        success: z.boolean(),
        data: appSettingsSchema,
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Get application settings',
  },
  updateAppSettings: {
    method: 'PATCH',
    path: '/app-settings',
    body: updateAppSettingsSchema,
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
        data: appSettingsSchema,
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Update application settings (Admin only)',
  },

  // QR Code endpoints
  getAllQRCodes: {
    method: 'GET',
    path: '/qrcodes',
    responses: {
      200: z.object({
        success: z.boolean(),
        data: z.array(qrCodeSchema),
        message: z.string(),
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Get all QR codes (admin)',
  },

  getAvailableQRCodes: {
    method: 'GET',
    path: '/qrcodes/available',
    responses: {
      200: z.object({
        success: z.boolean(),
        data: z.array(qrCodeSchema),
        message: z.string(),
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Get available QR codes for signup',
  },

  getQRCodeById: {
    method: 'GET',
    path: '/qrcodes/:id',
    responses: {
      200: z.object({
        success: z.boolean(),
        data: qrCodeSchema,
        message: z.string(),
      }),
      404: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Get QR code by ID',
  },

  createQRCode: {
    method: 'POST',
    path: '/qrcodes',
    body: createQRCodeSchema,
    responses: {
      201: z.object({
        success: z.boolean(),
        data: qrCodeSchema,
        message: z.string(),
      }),
      400: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Create new QR code (admin)',
  },

  updateQRCode: {
    method: 'PUT',
    path: '/qrcodes/:id',
    body: updateQRCodeSchema,
    responses: {
      200: z.object({
        success: z.boolean(),
        data: qrCodeSchema,
        message: z.string(),
      }),
      404: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Update QR code (admin)',
  },

  deleteQRCode: {
    method: 'DELETE',
    path: '/qrcodes/:id',
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      404: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      500: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
    summary: 'Delete QR code (admin)',
  },
});
