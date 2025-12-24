import { initServer } from '@ts-rest/express';
import { courseContract } from '../../../../../libs/shared/contracts/src/lib/course/contract';
import { courseMutationHandler } from './mutation';
import { courseQueryHandler } from './query';
const s = initServer();

export const courseRouter = s.router(courseContract, {
  createCourse: courseMutationHandler.createCourse,
  createVideoInCourse: courseMutationHandler.createVideoInCourse,
  getAllCourses: courseQueryHandler.getAllCourses,
  getVideosOfCourse: courseQueryHandler.getVideosOfCourse,
  getCourseById: courseQueryHandler.getCourseById,
});
