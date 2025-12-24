import { initContract } from "@ts-rest/core";
import { ErrorSchema, SuccessSchema } from "../common";
import {
  createPackageSchema,
  getAllPackagesSchema,
  getAllSrkGrowPackagesSchema,
  getPackageByIdSchema,
  srkGrowPackageSchema,
} from "./schema";
import { z } from "zod";

const c = initContract();

export const packageContract = c.router({
  createPackage: {
    method: "POST",
    path: "/package/create",
    body: createPackageSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Create a new package",
  },
  deletePackageById: {
    method: "DELETE",
    path: "/package/:id",
    body: z.object({}).optional(),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Delete a package by ID",
  },
  getAllPackages: {
    method: "GET",
    path: "/package/all",
    responses: {
      200: getAllPackagesSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get all packages",
  },
  getPackageById: {
    method: "GET",
    path: "/package/:id",
    responses: {
      200: getPackageByIdSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get a package by ID",
  },

  // SRK Grow Packages /grow/--
  getAllSrkGrowPackages: {
    method: "GET",
    path: "/grow/all",
    responses: {
      200: getAllSrkGrowPackagesSchema,
      500: ErrorSchema,
    },
    summary: "Get all SRK Grow packages",
  },

    getSrkGrowPackageById: {
    method: "GET",
    path: "/grow/package/:id",
    responses: {
      200: srkGrowPackageSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get SRK Grow package by ID",
  },
});
