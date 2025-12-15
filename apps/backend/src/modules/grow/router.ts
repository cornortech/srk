import { initServer } from "@ts-rest/express";
import { growContract } from "@srk/shared/contracts";
import { growMutationHandler } from "./mutation";

const s = initServer();

export const growRouter = s.router(growContract, {
    createGrowSocialMediaEnrollement: growMutationHandler.createGrowSocialMediaEnrollement,
    validateGrowUserPromoCode: growMutationHandler.validateGrowUserPromoCode,
    acceptSocialGrowEnrollementRequest: growMutationHandler.acceptSocialGrowEnrollementRequest,
    rejectSocialGrowEnrollementRequest: growMutationHandler.rejectSocialGrowEnrollementRequest,
});