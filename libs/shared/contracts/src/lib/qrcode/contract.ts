import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

// QR Code Schema
const qrCodeSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  qr: z.string().min(1, 'QR image is required'),
  isAvailable: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type QRCodeType = z.infer<typeof qrCodeSchema>;

// API Contract
export const qrcodeContract = c.router({
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
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      qr: z.string().min(1, 'QR image is required'),
    }),
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
    body: z.object({
      name: z.string().optional(),
      qr: z.string().optional(),
      isAvailable: z.boolean().optional(),
    }),
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
