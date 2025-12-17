import { initContract } from "@ts-rest/core";
import { LoginSchema, LoginSrkGrowSchema, LoginSuccessResponse, RegisterSchema } from "./schema";
import { ErrorSchema, SuccessSchema } from "../common";
import { z } from "zod";

const c = initContract();

export const authContract = c.router({
  register: {
    method: "POST",
    path: "/auth/register",
    responses: {
      201: SuccessSchema,
    },
    body: RegisterSchema,
    summary: "Register a new user",
  },
  login: {
    method: "POST",
    path: `/auth/login`,
    body: LoginSchema,
    responses: {
      200: LoginSuccessResponse,
    },
    summary: "Login a user",
  },
  approveKyc: {
    method: "POST",
    path: "/auth/approveKyc/:userId",
    body: z.object({}).optional(),
    responses: {
      201: SuccessSchema,
      403: SuccessSchema,
      404: SuccessSchema,
      500: SuccessSchema,
    },
    summary: "Approve KYC",
  },
  rejectKyc: {
    method: "POST",
    path: "/auth/rejectKyc/:userId",
    body: z.object({
      reason: z.string(),
    }),
    responses: {
      201: SuccessSchema,
      403: SuccessSchema,
      404: SuccessSchema,
      500: SuccessSchema,
    },
    summary: "Reject KYC",
  },
  rejectPaymentDetails: {
    method: "POST",
    path: "/auth/payment/reject-payment-verification/:userId",
    body: z.object({
      reason: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: SuccessSchema,
      404: SuccessSchema,
      500: SuccessSchema,
    },
  },
  approvePaymentDetails: {
    method: "POST",
    path: "/auth/payment/approve-payment-verification/:userId",
    body: z.object({}).optional(),
    responses: {
      200: SuccessSchema,
      403: SuccessSchema,
      404: SuccessSchema,
      500: SuccessSchema,
    },
  },
  editPaymentDetails: {
    method: "POST",
    path: "/auth/payment/edit-payment-verification/:userId",
    body: z.object({
      transactionId: z.string(),
      paymentMethod: z.enum(["esewa", "khalti", "bankTransfer"]),
      paymentProofUrl: z.string(),
    }),
    responses: {
      200: SuccessSchema,
      403: SuccessSchema,
      404: SuccessSchema,
      409: ErrorSchema,
      500: SuccessSchema,
    },
  },
  loginSrkGrow: {
    method: "POST",
    path: `/auth/login-srk-grow`,
    body: LoginSrkGrowSchema,
    responses: {
      201: SuccessSchema,
      403: SuccessSchema,
      404: SuccessSchema,
      500: SuccessSchema,
    },
    summary: "Login Srk Grow User",
  },
});
