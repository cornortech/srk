import { initServer } from '@ts-rest/express';
import { tourQuery } from './query';
import { tourContract } from '@srk/shared/contracts';
const s = initServer();

export const tourRouter = s.router(tourContract, {
  getUserTourTargets: tourQuery.getUserTourTargets,
  getTourTargets: tourQuery.getTourTargets,
  getActiveTourAchievements: tourQuery.getActiveTourAchievements,
});
