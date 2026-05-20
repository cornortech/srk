import { initServer } from "@ts-rest/express";
import { taskContract } from "@srk/shared/contracts";
import { taskQueryHandler } from "./query";
import { taskMutationHandler } from "./mutation";
import { withErrorHandling } from "../../utils/tsRestErrorHandler";

const s = initServer();

export const taskRouter = s.router(taskContract, {
    createSocialTaskPackage: withErrorHandling(taskMutationHandler.createSocialTaskPackage),
    getSocialTaskPackages: withErrorHandling(taskQueryHandler.getSocialTaskPackages),
    enrollSocialTaskPackage: withErrorHandling(taskMutationHandler.enrollSocialTaskPackage),
    getAllSocialTaskEnrollments: withErrorHandling(taskQueryHandler.getAllSocialTaskEnrollments),
    acceptTaskEnrollmentRequest: withErrorHandling(taskMutationHandler.acceptTaskEnrollmentRequest),
    rejectTaskEnrollmentRequest: withErrorHandling(taskMutationHandler.rejectTaskEnrollmentRequest),
    createSocialLinks: withErrorHandling(taskMutationHandler.createSocialLinks),
    getAllActiveSocialLinksToFollow: undefined,
    createSocialTaskFollowRequest: withErrorHandling(taskMutationHandler.createSocialTaskFollowRequest),
    approveSocialTaskFollowRequest: withErrorHandling(taskMutationHandler.approveSocialTaskFollowRequest),
    rejectSocialTaskFollowRequest: withErrorHandling(taskMutationHandler.rejectSocialTaskFollowRequest),
    getSocialTaskEarning: withErrorHandling(taskQueryHandler.getSocialTaskEarning)
});
