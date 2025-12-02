import { initServer } from "@ts-rest/express";
import { taskContract } from "../../contract/task/contract";
import { taskQueryHandler } from "./query";
import { taskMutationHandler } from "./mutation";
const s = initServer();

export const taskRouter = s.router(taskContract, {
    createSocialTaskPackage: taskMutationHandler.createSocialTaskPackage,
    getSocialTaskPackages: taskQueryHandler.getSocialTaskPackages,
    enrollSocialTaskPackage: taskMutationHandler.enrollSocialTaskPackage,
    getAllSocialTaskEnrollments: taskQueryHandler.getAllSocialTaskEnrollments,
    acceptTaskEnrollmentRequest: taskMutationHandler.acceptTaskEnrollmentRequest,
    rejectTaskEnrollmentRequest: taskMutationHandler.rejectTaskEnrollmentRequest,
    createSocialLinks: taskMutationHandler.createSocialLinks,
    getAllActiveSocialLinksToFollow: undefined,
    createSocialTaskFollowRequest: taskMutationHandler.createSocialTaskFollowRequest,
    approveSocialTaskFollowRequest:taskMutationHandler.approveSocialTaskFollowRequest,
    rejectSocialTaskFollowRequest:taskMutationHandler.rejectSocialTaskFollowRequest,
    getSocialTaskEarning:taskQueryHandler.getSocialTaskEarning
});
