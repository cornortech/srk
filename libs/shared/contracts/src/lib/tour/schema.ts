import { z } from 'zod';

export const getUserTourSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  tourId: z.string(),
  completed: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const getTourTargetSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createTourProgressSchema = z.object({
  tourId: z.string(),
});

// Inferred types
export type GetUserTour = z.infer<typeof getUserTourSchema>;
export type GetTourTarget = z.infer<typeof getTourTargetSchema>;
export type CreateTourProgress = z.infer<typeof createTourProgressSchema>;
