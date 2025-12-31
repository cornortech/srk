import mongoose from "mongoose";
export interface IGrowSocialMediaPackageType {
    growSocialMediaPackageId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const growSocialMediaPackageTypeSchema = new mongoose.Schema<IGrowSocialMediaPackageType>(
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