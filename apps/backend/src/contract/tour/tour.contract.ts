import { initContract } from "@ts-rest/core";
import { ErrorSchema } from "../common";
import {  getTourTargetSchema, getUserTourSchema } from "./tour.schema";

const c = initContract();

export const tourContract = c.router({
  getUserTourTargets: {
    method: "GET",
    path: "/tour",
    responses: {
      200: getUserTourSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get user details by user ID",
  },
  getTourTargets: {
    method: "GET",
    path: "/tour/targets",
    responses: {
      200: getTourTargetSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get tour targets",
  },
});
