import mongoose from "mongoose";

const growSocialMediaPackageUserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        country: {
            type: String,
            required: true,
        },
        kycURL: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["verificationPending", "portalActivated", "verificationRejected"],
            default: "verificationPending",
        },
        promoCode: {
            type: String,
            required: true,
            unique: true,
        },
        srkUniversityUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    },
);

export const growSocialMediaPackageUserModel = mongoose.model(
    "growSocialMediaPackageUser",
    growSocialMediaPackageUserSchema,
);