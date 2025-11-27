import { initServer } from "@ts-rest/express";
import { taskContract } from "../../contract/task/contract";
import { taskQueryHandler } from "./query";
import { taskMutationHandler } from "./mutation";
const s = initServer();

export const taskRouter = s.router(taskContract, {
    createSocialTaskPackage: taskMutationHandler.createSocialTaskPackage,
    getSocialTaskPackage: taskQueryHandler.getSocialTaskPackage,
    enrollSocialTaskPackage: taskMutationHandler.enrollSocialTaskPackage,
    getAllSocialTaskEnrollment: taskQueryHandler.getAllSocialTaskEnrollment,
    acceptTaskEnrollmentRequest: taskMutationHandler.acceptTaskEnrollmentRequest,
    rejectTaskEnrollmentRequest: taskMutationHandler.rejectTaskEnrollmentRequest,
    createSocialLinks: taskMutationHandler.createSocialLinks,
    getAllActiveSocialLinksToFollow: undefined,
    createSocialTaskFollowRequest: taskMutationHandler.createSocialTaskFollowRequest
});
