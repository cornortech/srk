import { initServer } from "@ts-rest/express";
import { packageContract } from "@srk/shared/contracts";
import { packageMutationHandler } from "./mutation";
import { packageQueryHandler } from "./query";
const s = initServer();

export const packageRouter = s.router(packageContract, {
  getAllPackages: packageQueryHandler.getAllPackages,
  getPackageById: packageQueryHandler.getPackageById,
  createPackage: packageMutationHandler.createPackage,
  deletePackageById: packageMutationHandler.deletePackageById,
  getAllSrkGrowPackages: packageQueryHandler.getAllSrkGrowPackages,
});
