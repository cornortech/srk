import { initContract } from "@ts-rest/core";
import { ErrorSchema, SuccessSchema } from "../common";
import {
  createPackageSchema,
  getAllPackagesSchema,
  getAllSrkGrowPackagesSchema,
  getPackageByIdSchema,
  srkGrowPackageSchema,
  createGrowSocialMediaPackageSchema,
  createGrowPackageTypeSchema,
  createGrowPackageSubTypeSchema,
  updateGrowSocialMediaPackageSchema,
  updateGrowPackageTypeSchema,
  updateGrowPackageSubTypeSchema,
  deletePackageSchema,
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

  // Create Grow Package
  createGrowSocialMediaPackage: {
    method: "POST",
    path: "/grow/package/create",
    body: createGrowSocialMediaPackageSchema,
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
        packageId: z.string(),
      }),
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Create a new SRK Grow package",
  },

  // Create Package Type
  createGrowPackageType: {
    method: "POST",
    path: "/grow/package/type/create",
    body: createGrowPackageTypeSchema,
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
        typeId: z.string(),
      }),
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Create a new package type",
  },

  // Create Package SubType
  createGrowPackageSubType: {
    method: "POST",
    path: "/grow/package/subtype/create",
    body: createGrowPackageSubTypeSchema,
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
        subTypeId: z.string(),
      }),
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Create a new package subtype",
  },

  // Update Grow Package
  updateGrowSocialMediaPackage: {
    method: "PATCH",
    path: "/grow/package/:id",
    pathParams: z.object({ id: z.string() }),
    body: updateGrowSocialMediaPackageSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Update SRK Grow package",
  },

  // Update Package Type
  updateGrowPackageType: {
    method: "PATCH",
    path: "/grow/package/type/:id",
    pathParams: z.object({ id: z.string() }),
    body: updateGrowPackageTypeSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Update package type",
  },

  // Update Package SubType
  updateGrowPackageSubType: {
    method: "PATCH",
    path: "/grow/package/subtype/:id",
    pathParams: z.object({ id: z.string() }),
    body: updateGrowPackageSubTypeSchema,
    responses: {
      200: SuccessSchema,
      400: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Update package subtype",
  },

  // Delete Grow Package
  deleteGrowSocialMediaPackage: {
    method: "DELETE",
    path: "/grow/package/:id",
    pathParams: z.object({ id: z.string() }),
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Delete SRK Grow package",
  },

  // Delete Package Type
  deleteGrowPackageType: {
    method: "DELETE",
    path: "/grow/package/type/:id",
    pathParams: z.object({ id: z.string() }),
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Delete package type",
  },

  // Delete Package SubType
  deleteGrowPackageSubType: {
    method: "DELETE",
    path: "/grow/package/subtype/:id",
    pathParams: z.object({ id: z.string() }),
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Delete package subtype",
  },
});
