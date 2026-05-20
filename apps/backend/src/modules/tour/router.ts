import { initServer } from '@ts-rest/express';
import { tourQuery } from './query';
import { tourContract } from '@srk/shared/contracts';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const tourRouter = s.router(tourContract, {
  getUserTourTargets: withErrorHandling(tourQuery.getUserTourTargets),
  getTourTargets: withErrorHandling(tourQuery.getTourTargets),
  getActiveTourAchievements: withErrorHandling(tourQuery.getActiveTourAchievements),
});
