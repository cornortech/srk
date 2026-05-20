import { initServer } from '@ts-rest/express';
import { webinarContract } from '@srk/shared/contracts';
import { webinarMutationHandler } from './mutation';
import { webinarQueryHandler } from './query';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const webinarRouter = s.router(webinarContract, {
  createWebinar: withErrorHandling(webinarMutationHandler.createWebinar),
  getAllWebinars: withErrorHandling(webinarQueryHandler.getAllWebinar),
  deleteWebinar: withErrorHandling(webinarMutationHandler.deleteWebinar),
  updateWebinar: withErrorHandling(webinarMutationHandler.updateWebinar),
});
