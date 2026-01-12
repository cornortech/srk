import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { appSettingsSchema, updateAppSettingsSchema } from './schema';

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
});
