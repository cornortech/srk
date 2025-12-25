import mongoose from "mongoose";

const growSrkAffiliateUserEarningsPayoutSchema = new mongoose.Schema(
    {
        growSocialMediaPackageUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageUser",
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['requested', 'approved', 'rejected'],
            required: true,
        },
        rejectionReason: {
            type: String,
        },
        paymentScreenshot: {
            type: String,
        }
    },
    {
        timestamps: true,
    },
)

export const growSrkAffiliateUserEarningsPayoutModel = mongoose.model(
    "growSrkAffiliateUsersEarningsPayout",
    growSrkAffiliateUserEarningsPayoutSchema,
);