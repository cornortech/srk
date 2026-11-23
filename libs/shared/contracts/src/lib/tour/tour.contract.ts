import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorSchema, SuccessSchema } from "../common";
import {  getTourTargetSchema, getUserTourSchema, createTourTargetSchema, setTourTargetActiveSchema, getActiveTourAchievementsSchema } from "./tour.schema";

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
  getActiveTourAchievements: {
    method: "GET",
    path: "/tour/active-achievements",
    responses: {
      200: getActiveTourAchievementsSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get achievements for the active tour with user details",
  },

  // ---- admin ----
  createTourTarget: {
    method: "POST",
    path: "/tour/admin/targets",
    body: createTourTargetSchema,
    responses: { 201: SuccessSchema, 400: ErrorSchema, 500: ErrorSchema },
    summary: "Create a tour target (admin)",
  },
  updateTourTarget: {
    method: "PUT",
    path: "/tour/admin/targets/:targetId",
    body: createTourTargetSchema,
    responses: { 200: SuccessSchema, 400: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    summary: "Edit a tour target (admin)",
  },
  setTourTargetActive: {
    method: "POST",
    path: "/tour/admin/targets/:targetId/active",
    body: setTourTargetActiveSchema,
    responses: { 200: SuccessSchema, 404: ErrorSchema, 500: ErrorSchema },
    summary: "Make a tour target the active one, or deactivate it (admin)",
  },
  deleteTourTarget: {
    method: "DELETE",
    path: "/tour/admin/targets/:targetId",
    body: z.object({}),
    responses: { 200: SuccessSchema, 400: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
    summary: "Delete a tour target that has no user progress (admin)",
  },
});
