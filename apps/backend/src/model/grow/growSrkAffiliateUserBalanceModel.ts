import mongoose from "mongoose";

const growSrkAffiliateUserBalanceSchema = new mongoose.Schema(
    {
        growSocialMediaPackageUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageUser",
            required: true,
        },
        wallet: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    },
)

export const growSrkAffiliateUserBalanceModel = mongoose.model(
    "growSrkAffiliateUserBalance",
    growSrkAffiliateUserBalanceSchema,
);