import { z } from "zod";

export const createWebinarSchema = z.object({
  title: z.string(),
  meetUrl: z.string(),
  startTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start time",
    })
    .transform((val) => new Date(val)),
  endTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end time",
    })
    .transform((val) => new Date(val)),
});

export const getWebinarSchema = z.object({
  _id: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  title: z.string(),
  meetUrl: z.string(),
});