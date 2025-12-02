import mongoose from "mongoose";

const socialTaskPackageEnrollmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        socialTaskPackage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SocialTaskPackage",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        remarks: {
            type: String,
            default: ""
        },
        paymentScreenshotUrl: {
            type: String,
            required: true
        },
        expirationDate: {
            type: Date,
            required: true
        },
        isExpired: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

export const SocialTaskPackageEnrollmentModel = mongoose.model("SocialTaskPackageEnrollment", socialTaskPackageEnrollmentSchema);
