import { initServer } from '@ts-rest/express';
import { courseContract } from '@srk/shared/contracts';
import { courseMutationHandler } from './mutation';
import { courseQueryHandler } from './query';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const courseRouter = s.router(courseContract, {
  createCourse: withErrorHandling(courseMutationHandler.createCourse),
  createVideoInCourse: withErrorHandling(courseMutationHandler.createVideoInCourse),
  getAllCourses: withErrorHandling(courseQueryHandler.getAllCourses),
  getVideosOfCourse: withErrorHandling(courseQueryHandler.getVideosOfCourse),
  getCourseById: withErrorHandling(courseQueryHandler.getCourseById),
});
