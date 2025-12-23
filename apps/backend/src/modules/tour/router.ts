import { initServer } from '@ts-rest/express';
import { tourContract } from '../../../../../libs/shared/contracts/src/lib/tour/tour.contract';
import { tourQuery } from './query';
const s = initServer();

export const tourRouter = s.router(tourContract, {
  getUserTourTargets: tourQuery.getUserTourTargets,
  getTourTargets: tourQuery.getTourTargets,
});
