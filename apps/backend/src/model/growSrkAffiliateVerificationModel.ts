import mongoose from "mongoose";

const srkGrowAffiliateVerificationSchema = new mongoose.Schema(
    {
        srkUniversityUserId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
            unique: true
        },
        verificationImageUrl: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
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
    "srkGrowAffiliateVerification",
    srkGrowAffiliateVerificationSchema,
);