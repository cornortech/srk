import { initServer } from "@ts-rest/express";
import { growContract } from "@srk/shared/contracts";
import { growMutationHandler } from "./mutation";
import { growEnrollmentUserQueryHandler } from "./query";

const s = initServer();

export const growRouter = s.router(growContract, {
    createGrowSocialMediaEnrollement: growMutationHandler.createGrowSocialMediaEnrollement,
    getAllGrowSocialMediaEnrollement: growEnrollmentUserQueryHandler.getAllSrkGrowEnrollementUser,
    getGrowSocialMediaEnrollementById: growEnrollmentUserQueryHandler.getSrkGrowEnrollementUserById,
    validateGrowUserPromoCode: growMutationHandler.validateGrowUserPromoCode,
    acceptSocialGrowEnrollementRequest: growMutationHandler.acceptSocialGrowEnrollementRequest,
    rejectSocialGrowEnrollementRequest: growMutationHandler.rejectSocialGrowEnrollementRequest,
});