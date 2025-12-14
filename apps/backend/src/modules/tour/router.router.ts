import { initServer } from "@ts-rest/express";
import { tourContract } from "@srk/shared/contracts";
import { tourQuery } from "./tour.query";
const s = initServer();

export const tourRouter = s.router(tourContract, {
  getUserTourTargets: tourQuery.getUserTourTargets,
  getTourTargets: tourQuery.getTourTargets,
});