import mongoose from "mongoose";

const growSocialMediaPackagePaymentSchema = new mongoose.Schema(
    {
        growPackageEnrollementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageEnrollment",
            required: true,
        },
        paymentURL: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        paymentMethod: {
            type: String,
            enum: ["esewa", "khalti", "bankTransfer"],
            required: true,
        },
        status: {
            type: String,
            enum: ["approved", "pending", "rejected"],
            default: "pending",
        },
        rejectionReason: {
            type: String,
            default: null,
        },
    }, 
    {
        timestamps: true,
    },
);

export const growSocialMediaPackagePaymentModel = mongoose.model(
    "growSocialMediaPackagePayment",
    growSocialMediaPackagePaymentSchema,
);