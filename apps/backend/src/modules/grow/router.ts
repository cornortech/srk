import { initServer } from '@ts-rest/express';
import { growContract } from '@srk/shared/contracts';
import { growMutationHandler } from './mutation';
import { growQueryHandler } from './query';

const s = initServer();

export const growRouter = s.router(growContract, {
  createGrowSocialMediaEnrollement:
    growMutationHandler.createGrowSocialMediaEnrollement,
  validateGrowUserPromoCode: growMutationHandler.validateGrowUserPromoCode,
  acceptSocialGrowEnrollmentRequest:
    growMutationHandler.acceptSocialGrowEnrollmentRequest,
  rejectSocialGrowEnrollmentRequest:
    growMutationHandler.rejectSocialGrowEnrollmentRequest,
  getSrkGrowProfile: growQueryHandler.getSrkGrowProfile,
  resubmitGrowVerification: growMutationHandler.resubmitGrowVerification,
});
