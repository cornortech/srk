import { z } from 'zod';

// Payment QR Type enum values (duplicated from @srk/shared/types for schema compilation)
export enum PaymentQRType {
  SRK_INDUSTRIES = 'srkIndustries',
  SRK_ORGANIZATION = 'srkOrganization',
}

// Schema for app settings
export const appSettingsSchema = z.object({
  _id: z.string(),
  taskFeatureEnabled: z.boolean(),
  maintenanceMode: z.boolean(),
  announcementMessage: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Schema for updating app settings (no _id, timestamps)
export const updateAppSettingsSchema = z.object({
  taskFeatureEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  announcementMessage: z.string().optional(),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;
export type UpdateAppSettings = z.infer<typeof updateAppSettingsSchema>;

// QR Code Schema
export const qrCodeSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  qr: z.string().min(1, 'QR image is required'),
  isAvailable: z.boolean().default(true),
  type: z.enum(Object.values(PaymentQRType) as [string, ...string[]]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for creating QR code
export const createQRCodeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  qr: z.string().min(1, 'QR image is required'),
  type: z.enum(Object.values(PaymentQRType) as [string, ...string[]]),
});

// Schema for updating QR code
export const updateQRCodeSchema = z.object({
  name: z.string().optional(),
  qr: z.string().optional(),
  isAvailable: z.boolean().optional(),
  type: z.enum(Object.values(PaymentQRType) as [string, ...string[]]).optional(),
});

export type QRCode = z.infer<typeof qrCodeSchema>;
export type CreateQRCode = z.infer<typeof createQRCodeSchema>;
export type UpdateQRCode = z.infer<typeof updateQRCodeSchema>;
