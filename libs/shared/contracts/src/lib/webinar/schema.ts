import { z } from 'zod';

export const createWebinarSchema = z.object({
  title: z.string(),
  meetUrl: z.string().url(),
  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid start time',
    })
    .transform((val) => new Date(val)),
  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid end time',
    })
    .transform((val) => new Date(val)),
});

export const getWebinarSchema = z.object({
  _id: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  title: z.string(),
  meetUrl: z.string().url(),
});

// Inferred types
export type CreateWebinar = z.infer<typeof createWebinarSchema>;
export type GetWebinar = z.infer<typeof getWebinarSchema>;
