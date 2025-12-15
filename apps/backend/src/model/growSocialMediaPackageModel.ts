import mongoose from "mongoose";

const growSocialMediaPackageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            requred: true,
        },
        description: {
            type: String,
            required: true,
        },
        socialMediaPlatforms: {
            type: [String],
            enum: ["Instagram", "TikTok", "YouTube", "Twitter", "Facebook"],
            default: [],
        },
        features: {
            type: [String],
            required: true,
        },
        amountBeforeDiscount: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        isPopular: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

export const growSocialMediaPackageModel = mongoose.model(
    "growSocialMediaPackage",
    growSocialMediaPackageSchema,
);