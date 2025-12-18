import mongoose from "mongoose";

const growSrkAffiliateVerificationSchema = new mongoose.Schema(
    {
        srkuniversityUserId: {
            type: String,
            required: true,
            unique: true
        },
        verificationImageUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export const growSrkAffiliateVerificationModel = mongoose.model(
    "growSrkAffiliateVerification",
    growSrkAffiliateVerificationSchema,
);