import { initContract } from "@ts-rest/core";
import { ErrorSchema, SuccessSchema } from "../common";
import { createSocialTaskPackageEnrollmentSchema, createSocialTaskPackageSchema } from "./schema";

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
    path: "/social-task-enrollements-by-status",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema
    },
    summary: "Get All Social Task Enrollments by Status"
  }
});
