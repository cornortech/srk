import { z } from "zod";

export const createSocialTaskPackageSchema = z.object({
    name: z.string(),
    features: z.string().array(),
    totalNumberOfFollowers: z.number(),
    price: z.number(),
    isPopular: z.boolean()
});
export type TCreateSocialTaskPackageSchema = z.TypeOf<typeof createSocialTaskPackageSchema>;

export const createSocialTaskPackageEnrollmentSchema = z.object({
    userId: z.string(),
    socialTaskPackage: z.string(),
    status: z.string(),
    remarks: z.string(),
    paymentScreenshotUrl: z.string(),
    expirationDate: z.coerce.date(),
    isExpired: z.boolean()
});
export type TCreateSocialTaskPackageEnrollmentSchema = z.TypeOf<typeof createSocialTaskPackageEnrollmentSchema>;

export const createSocialLinkSchema = z.object({
    userId: z.string(),
    facebookurl: z.string(),
    instagramUrl: z.string(),
    tiktokUrl: z.string(),
    youtubeUrl: z.string()
});
export type TCreateSocialLinkSchema = z.TypeOf<typeof createSocialLinkSchema>;

export const createSocialTaskFollowRequestSchema = z.object({
    followedBy: z.string(),
    followedTo: z.string(),
    socialMedia: z.string(),
    status: z.string(),
    screenshotUrl: z.string(),
    remarks: z.string()
});
export type TCreateSocialTaskFollowRequestSchema = z.TypeOf<typeof createSocialTaskFollowRequestSchema>;

export const createSocialTaskEarningStatementSchema = z.object({
    followedBy: z.string(),
    followedTo: z.string(),
    amount: z.number()
});
export type TCreateSocialTaskEarningStatementSchema = z.TypeOf<typeof createSocialTaskEarningStatementSchema>;

export const createSocialTaskBalanceSchema = z.object({
    userId: z.string(),
    balance: z.number(),
    totalEarnings: z.number()
});
export type TCreateSocialTaskBalanceSchema = z.TypeOf<typeof createSocialTaskBalanceSchema>;
