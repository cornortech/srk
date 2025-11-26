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
    summary: "Create a new package",
  },
  getSocialTaskPackage: {
    method: "GET",
    path: "/social-task-package",
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    }
  },
  enrollSocialTaskPackage: {
    method: "POST",
    path: "social-task-package/enroll",
    body: createSocialTaskPackageEnrollmentSchema,
    responses: {
      200: SuccessSchema,
      403: ErrorSchema,
      404: ErrorSchema,
      500: ErrorSchema,
    }
  }
});
