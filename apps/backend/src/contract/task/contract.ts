import { initContract } from "@ts-rest/core";
import { ErrorSchema, SuccessSchema } from "../common";
import { createSocialLinkSchema, createSocialTaskFollowRequestSchema, createSocialTaskPackageEnrollmentSchema, createSocialTaskPackageSchema } from "./schema";
import z from "zod";

const c = initContract();

export const taskContract = c.router({
  createSocialTaskPackage: {
    method: "POST",
    path: "/social-task-package",
    body: createSocialTaskPackageSchema,
    responses: {
      201: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Create a New Package",
  },
  getSocialTaskPackage: {
    method: "GET",
    path: "/social-task-package",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get Social Task Package"
  },
  enrollSocialTaskPackage: {
    method: "POST",
    path: "/social-task-package/enroll",
    body: createSocialTaskPackageEnrollmentSchema,
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Enroll in Social Task Package"
  },
  getAllSocialTaskEnrollment: {
    method: "GET",
    path: "/social-task-enrollement-by-status",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Get All Social Task Enrollments by Status"
  },
  acceptTaskEnrollmentRequest: {
    method: "PATCH",
    body: z.object({
      remarks: z.string().optional()
    }),
    path: "/accept-social-task-enrollement-request/:id",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Accept Social Task Enrollment by Id"
  },
  rejectTaskEnrollmentRequest: {
    method: "PATCH",
    body: z.object({
      remarks: z.string().optional()
    }),
    path: "/reject-social-task-enrollment-request/:id",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Reject Social Task Enrollment by Id"
  },
  createSocialLinks: {
    method: "POST",
    body: createSocialLinkSchema,
    path: "/create-social-links",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Create Social Links"
  },
  getAllActiveSocialLinksToFollow: {
    method: "GET",
    path: "/get-all-active-social-links-to-follow",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Get All Active Social Links to Follow"
  },
  createSocialTaskFollowRequest: {
    method: "POST",
    body: createSocialTaskFollowRequestSchema,
    path: "/create-social-task-follow-request/:id",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Create Social Task Follow Request"
  },
  approveSocialTaskFollowRequest:{
    method: "PATCH",
    path: "/approve-social-task-follow-request/:id",
    body: z.object({
      remarks: z.string().optional()
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Approve Social Task Follow Request by Id"
  }
  
});
