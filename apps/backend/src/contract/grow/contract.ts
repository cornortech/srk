import { initContract } from "@ts-rest/core";
import { createGrowSocialMediaEnrollementSchema } from "./schema";
import { ErrorSchema, SuccessSchema } from "../common";
import { error } from "console";

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
});