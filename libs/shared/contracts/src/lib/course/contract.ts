import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { ErrorSchema, SuccessSchema } from '../common';
import {
  createCourseSchema,
  createVideoInCourseSchema,
  getAllCoursesSchema,
  getAllVideosOfCourseSchema,
  getCourseByIdSchema,
} from './schema';

const c = initContract();

export const courseContract = c.router({
  createCourse: {
    method: 'POST',
    path: '/course/create',
    body: createCourseSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a new course',
  },
  getAllCourses: {
    method: 'GET',
    query: z.object({
      packageId: z.string().optional(),
    }),
    path: '/course/getAllCourses',
    responses: {
      200: getAllCoursesSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all courses',
  },
  getCourseById: {
    method: 'GET',
    path: '/course/:id',
    responses: {
      200: getCourseByIdSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all courses',
  },
  createVideoInCourse: {
    method: 'POST',
    path: '/course/createVideoInCourse/:courseId',
    body: createVideoInCourseSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Create a new course',
  },
  getVideosOfCourse: {
    method: 'GET',
    path: '/course/getVideosOfCourse/:courseId',
    responses: {
      200: getAllVideosOfCourseSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: 'Get all courses',
  },
});
