import { initContract } from "@ts-rest/core";
import { createGrowSocialMediaEnrollementSchema } from "./schema";
import { ErrorSchema, SuccessSchema } from "../common";
import { z } from "zod";

const c = initContract();

export const growContract = c.router({
    createGrowSocialMediaEnrollement: {
        method: "POST",
        path: "/grow/social-media/enrollement",
        body: createGrowSocialMediaEnrollementSchema,
        responses: {
            201: SuccessSchema,
            400: ErrorSchema,
            500: ErrorSchema,
        },
        summary: "Create a new grow social media enrollement",
    },

    acceptSocialGrowFollowRequest: {
        method: "PATCH",
        path: "/accept-social-grow-follow-request/:id",
        body: z.object({}),
        responses: {
            200: SuccessSchema,
            403: ErrorSchema,
            404: ErrorSchema,
            500: ErrorSchema
        },
        summary: "Approve Social Grow Follow Request by Id"
    },
});