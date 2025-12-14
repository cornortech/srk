import mongoose from "mongoose";

const growSocialMediaPackageTypeSchema = new mongoose.Schema(
    {
        growSocialMediaPackageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackage",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const growSocialMediaPackageTypeModel = mongoose.model(
    "growSocialMediaPackageType",
    growSocialMediaPackageTypeSchema,
);