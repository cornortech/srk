import { initContract } from "@ts-rest/core";
import { ErrorSchema, SuccessSchema } from "../common";
import { createWebinarSchema, getWebinarSchema } from "./schema";
import { z } from "zod";

const c = initContract();

export const webinarContract = c.router({
  createWebinar: {
    method: "POST",
    path: "/webinar/create",
    body: createWebinarSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Create a new package",
  },
  getAllWebinars: {
    method: "GET",
    path: "/webinar/all",
    responses: {
      200: z.array(getWebinarSchema),
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get all webinars",
  },
  deleteWebinar: {
    method: "DELETE",
    body: z.object({}),
    path: "/webinar/:id",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Delete a webinar by ID",
  },
  updateWebinar: {
    method: "PUT",
    body: createWebinarSchema,
    path: "/webinar/:id",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Update a webinar by ID",
  },
});
