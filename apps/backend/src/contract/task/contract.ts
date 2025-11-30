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
  getSocialTaskPackages: {
    method: "GET",
    path: "/social-task-packages",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Get Social Task Packages"
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
  getAllSocialTaskEnrollments: {
    method: "GET",
    path: "/social-task-enrollements-by-status",
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
    path: "/accept-social-task-enrollement-request/:id",
    body: z.object({}), // no fields required
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
    path: "/reject-social-task-enrollment-request/:id",
    body: z.object({
      rejectionReason: z.string()
    }),
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
    path: "/create-social-links",
    body: createSocialLinkSchema,
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
    path: "/create-social-task-follow-request/:id",
    body: createSocialTaskFollowRequestSchema,
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Create Social Task Follow Request"
  },
  approveSocialTaskFollowRequest: {
    method: "PATCH",
    path: "/approve-social-task-follow-request/:id",
    body: z.object({}),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Approve Social Task Follow Request by Id"
  },
  rejectSocialTaskFollowRequest: {
    method: "PATCH",
    path: "/reject-social-task-follow-request/:id",
    body: z.object({
      rejectionReason: z.string()
    }),
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Reject Social Task Follow Request by Id"
  },
  getSocialTaskEarning: {
    method: "GET",
    path: "/get-social-task-earning/:id",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Get Social Task Earning by Id"
  }

});
