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
        amount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const growSocialMediaPackageModel = mongoose.model(
    "growSocialMediaPackage",
    growSocialMediaPackageSchema,
);