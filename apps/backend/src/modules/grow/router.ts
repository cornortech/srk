import { initServer } from "@ts-rest/express";
import { growContract } from "@srk/shared/contracts";
import { growMutationHandler } from "./mutation";
import { growQueryHandler } from "./query";

const s = initServer();

export const growRouter = s.router(growContract, {
    createGrowSocialMediaEnrollement: growMutationHandler.createGrowSocialMediaEnrollement,
    getAllGrowSocialMediaEnrollement: growQueryHandler.getAllSrkGrowEnrollementUser,
    getGrowSocialMediaEnrollementById: growQueryHandler.getSrkGrowEnrollementUserById,
    validateGrowUserPromoCode: growMutationHandler.validateGrowUserPromoCode,
    acceptSocialGrowEnrollmentRequest: growMutationHandler.acceptSocialGrowEnrollmentRequest,
    rejectSocialGrowEnrollmentRequest: growMutationHandler.rejectSocialGrowEnrollmentRequest,
    srkGrowAffiliateVerificationRequest:growMutationHandler.srkGrowAffiliateVerificationRequest,
    getAllSrkGrowAffiliateVerificationRequest: growQueryHandler.getAllSrkGrowAffiliateVerificationRequest,
    approveSrkGrowAffiliateVerificationRequest: growMutationHandler.approveSrkGrowAffiliateVerificationRequest,
    rejectSrkGrowAffiliateVerificationRequest: growMutationHandler.rejectSrkGrowAffiliateVerificationRequest
});