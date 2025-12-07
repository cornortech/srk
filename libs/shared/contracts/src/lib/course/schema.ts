import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string(),
  package: z.string().array(),
});

export const getAllCoursesSchema = z.array(
  z.object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
);

export const getCourseByIdSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllVideosOfCourseSchema = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
    videoUrl: z.string(),
    thumbnailUrl: z.string(),
    created_at: z.date(),
    updatedAt: z.date(),
  })
);

export const createVideoInCourseSchema = z.object({
  name: z.string(),
  videoUrl: z.string(),
  thumbnailUrl: z.string().optional(),
  duration: z.number(),
});

// Inferred types
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type GetAllCourses = z.infer<typeof getAllCoursesSchema>;
export type GetCourseById = z.infer<typeof getCourseByIdSchema>;
export type GetAllVideosOfCourse = z.infer<typeof getAllVideosOfCourseSchema>;
export type CreateVideoInCourse = z.infer<typeof createVideoInCourseSchema>;
