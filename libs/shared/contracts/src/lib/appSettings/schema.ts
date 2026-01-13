import { z } from 'zod';

// Schema for app settings
export const appSettingsSchema = z.object({
  _id: z.string(),
  taskFeatureEnabled: z.boolean(),
  maintenanceMode: z.boolean(),
  announcementMessage: z.string(),
  qrcodeUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Schema for updating app settings (no _id, timestamps)
export const updateAppSettingsSchema = z.object({
  taskFeatureEnabled: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  announcementMessage: z.string().optional(),
  qrcodeUrl: z.string().optional(),
});

export type AppSettings = z.infer<typeof appSettingsSchema>;
export type UpdateAppSettings = z.infer<typeof updateAppSettingsSchema>;
