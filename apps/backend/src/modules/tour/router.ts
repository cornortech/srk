import { initServer } from '@ts-rest/express';
import { tourQuery } from './query';
import { tourMutation } from './mutation';
import { tourContract } from '@srk/shared/contracts';
import { JwtAuthMiddleware, JwtAdminMiddleware } from '../../utils/middleware';
import { createDataUrlUploadMiddleware } from '../../utils/dataUrlUploadMiddleware';
const s = initServer();

const admin = [JwtAuthMiddleware, JwtAdminMiddleware];

// A picked photo arrives as a data URL and is stored before the handler runs
const tourImageUpload = createDataUrlUploadMiddleware({
  image: { folder: 'university/tour-targets', prefix: 'tour-target', compress: true },
});

export const tourRouter = s.router(tourContract, {
  getUserTourTargets: tourQuery.getUserTourTargets,
  getTourTargets: tourQuery.getTourTargets,
  getActiveTourAchievements: tourQuery.getActiveTourAchievements,
  createTourTarget: {
    middleware: [...admin, tourImageUpload],
    handler: tourMutation.createTourTarget,
  },
  updateTourTarget: {
    middleware: [...admin, tourImageUpload],
    handler: tourMutation.updateTourTarget,
  },
  setTourTargetActive: {
    middleware: admin,
    handler: tourMutation.setTourTargetActive,
  },
  deleteTourTarget: {
    middleware: admin,
    handler: tourMutation.deleteTourTarget,
  },
});
