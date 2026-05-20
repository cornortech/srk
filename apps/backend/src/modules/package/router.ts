import { initServer } from '@ts-rest/express';
import { packageContract } from '@srk/shared/contracts';
import { packageMutationHandler } from './mutation';
import { packageQueryHandler } from './query';
import { withErrorHandling } from '../../utils/tsRestErrorHandler';

const s = initServer();

export const packageRouter = s.router(packageContract, {
  getAllPackages: withErrorHandling(packageQueryHandler.getAllPackages),
  getPackageById: withErrorHandling(packageQueryHandler.getPackageById),
  createPackage: withErrorHandling(packageMutationHandler.createPackage),
  deletePackageById: withErrorHandling(packageMutationHandler.deletePackageById),
  getAllSrkGrowPackages: withErrorHandling(packageQueryHandler.getAllSrkGrowPackages),
  getSrkGrowPackageById: withErrorHandling(packageQueryHandler.getSrkGrowPackageById),
  
  // Grow Package CRUD
  createGrowSocialMediaPackage: withErrorHandling(packageMutationHandler.createGrowSocialMediaPackage),
  createGrowPackageType: withErrorHandling(packageMutationHandler.createGrowPackageType),
  createGrowPackageSubType: withErrorHandling(packageMutationHandler.createGrowPackageSubType),
  updateGrowSocialMediaPackage: withErrorHandling(packageMutationHandler.updateGrowSocialMediaPackage),
  updateGrowPackageType: withErrorHandling(packageMutationHandler.updateGrowPackageType),
  updateGrowPackageSubType: withErrorHandling(packageMutationHandler.updateGrowPackageSubType),
  deleteGrowSocialMediaPackage: withErrorHandling(packageMutationHandler.deleteGrowSocialMediaPackage),
  deleteGrowPackageType: withErrorHandling(packageMutationHandler.deleteGrowPackageType),
  deleteGrowPackageSubType: withErrorHandling(packageMutationHandler.deleteGrowPackageSubType),
});
