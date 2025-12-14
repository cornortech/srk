import { initServer } from "@ts-rest/express";
import { growContract } from "../../contract/grow/contract";
import { growMutationHandler } from "./mutation";

const s = initServer();

export const growRouter = s.router(growContract, {
    createGrowSocialMediaEnrollement: growMutationHandler.createGrowSocialMediaEnrollement,
    validateGrowUserPromoCode: growMutationHandler.validateGrowUserPromoCode,
    acceptSocialGrowFollowRequest: growMutationHandler.acceptSocialGrowFollowRequest,
    rejectSocialGrowFollowRequest: growMutationHandler.rejectSocialGrowFollowRequest,
});