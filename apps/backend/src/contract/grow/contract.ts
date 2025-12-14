import { initContract } from "@ts-rest/core";
import { createGrowSocialMediaEnrollementSchema, validateGrowUserPromoCodeResponseSchema, validateGrowUserPromoCodeSchema } from "./schema";
import { ErrorSchema, SuccessSchema } from "../common";

const c = initContract();

export const growContract = c.router({
    createGrowSocialMediaEnrollement: {
        method: "POST",
        path: "/social-media-enrollement",
        body: createGrowSocialMediaEnrollementSchema,
        responses: {
            201: SuccessSchema,
            400: ErrorSchema,
            409: ErrorSchema,
            500: ErrorSchema,
        },
        summary: "Create a new grow social media enrollement for user with user details and payment details",
    },

    validateGrowUserPromoCode: {
        method: "POST",
        path: "/validate-promo-code",
        body: validateGrowUserPromoCodeSchema,
        responses: {
            200: validateGrowUserPromoCodeResponseSchema,
            400: ErrorSchema,
            409: ErrorSchema,
            500: ErrorSchema,
        },
        summary: "Validate enetered promo code and return its details with discount",
    },
});