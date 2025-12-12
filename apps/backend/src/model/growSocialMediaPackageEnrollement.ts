import mongoose from "mongoose"

const growSocialMediaPackageEnrollmentSchema = new mongoose.Schema(
    {
        growSocialMediaPackageUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageUser",
            required: true,
        },
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
        growSocialMediaPackageSubTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageSubType",
            required: true,
        },
        profileLinkURL: {
            type: String,
            required: true,
        },
    }, 
    {
        timestamps: true,
    },
);

export const growSocialMediaPackageEnrollmentModel = mongoose.model(
    "growSocialMediaPackageEnrollment",
    growSocialMediaPackageEnrollmentSchema,
);