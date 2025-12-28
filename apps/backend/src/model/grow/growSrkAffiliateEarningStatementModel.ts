import mongoose from "mongoose";

const growSrkAffiliateEarningStatementSchema = new mongoose.Schema(
    {
        refferedBY: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageUser",
        },
        refferedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageUser",
            required: true,
        },
        growSocialMediaPackageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackage",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    },
)

export const growSrkAffiliateEarningStatementModel = mongoose.model(
    "growSrkAffiliateEarningStatement",
    growSrkAffiliateEarningStatementSchema,
);