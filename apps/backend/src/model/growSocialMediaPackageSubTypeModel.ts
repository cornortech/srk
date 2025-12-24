import mongoose from "mongoose";

const growSocialMediaPackageSubTypeSchema = new mongoose.Schema(
    {
        growSocialMediaPackageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackage",
            required: true,
        },
        growSocialMediaPackageTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageType",
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
        taskType: {
            type: String,
            required: true,
            enum: ["follow", "engagement"],
        },
        noOfLikes: {
            type: Number,
        },
        noOfVideos: {
            type: Number,
        },
        noOfFollowers: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

export const growSocialMediaPackageSubTypeModel = mongoose.model(
    "growSocialMediaPackageSubType",
    growSocialMediaPackageSubTypeSchema,
);