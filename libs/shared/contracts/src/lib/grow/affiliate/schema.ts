import z from "zod";

export const getGrowSrkAffiliateUserBalance = z.object({
    growSocialMediaPackageUserId: z.string(),
    wallet: z.number(),
});