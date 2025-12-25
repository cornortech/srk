import { initContract } from "@ts-rest/core";
import { ErrorSchema, SuccessSchema } from "../../common";

const c = initContract();

export const growAffiliateContract = c.router({

    getGrowAffiliateUser: {
        method: "GET",
        path: "/get-grow-affiliate-user-profile/:id",
        responses: {
            200: SuccessSchema,
            403: ErrorSchema,
            404: ErrorSchema,
            500: ErrorSchema
        },
        summary: "Get Grow Affiliate User Profile by Id"
    }
});
