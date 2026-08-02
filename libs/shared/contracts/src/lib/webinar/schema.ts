import { z } from "zod";

export const createWebinarSchema = z
  .object({
    title: z.string(),
    hasFinished: z.boolean().default(false),
    meetUrl: z.string().optional(),
    youtubeUrl: z.string().optional(),
    thumbnail: z.string().optional(),
  })
  .refine((data) => (data.hasFinished ? !!data.youtubeUrl : !!data.meetUrl), {
    message:
      "Provide a YouTube URL for a finished webinar, or a Meet/Zoom URL for an upcoming webinar",
    path: ["meetUrl"],
  });

export const getWebinarSchema = z.object({
  _id: z.string(),
  title: z.string(),
  hasFinished: z.boolean(),
  meetUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  thumbnail: z.string().optional(),
});
