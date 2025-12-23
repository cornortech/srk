import { initServer } from "@ts-rest/express";
import { tourContract } from "../../contract/tour/tour.contract";
import { tourQuery } from "./tour.query";
const s = initServer();

export const tourRouter = s.router(tourContract, {
  getUserTourTargets: tourQuery.getUserTourTargets,
  getTourTargets: tourQuery.getTourTargets,
});