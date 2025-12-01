import mongoose from "mongoose";

const socialTaskPackageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        features: {
            type: [String],
            default: []
        },
        totalNumberOfFollowers: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        isPopular: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);


export const SocialTaskPackageModel = mongoose.model("SocialTaskPackage", socialTaskPackageSchema);
