import mongoose from "mongoose";

const growPackageEngagementPostSchema = new mongoose.Schema(
    {
        growSocialMediaPackageEnrollmentId: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "growSocialMediaPackageEnrollment",
            required: true,
        },
        postURLs: {
            type: [String],
        }
    },
    {
        timestamps: true
    }
)

export const growPackageEngagementPostModel = mongoose.model(
    "growPackageEngagementPost",
    growPackageEngagementPostSchema
)