import { initServer } from "@ts-rest/express";
import { growContract } from "../../contract/grow/contract";
import { growMutationHandler } from "./muation";

const s = initServer();

export const growRouter = s.router(growContract, {
    createGrowSocialMediaEnrollement: undefined,
    acceptSocialGrowFollowRequest: growMutationHandler.acceptSocialGrowFollowRequest
});