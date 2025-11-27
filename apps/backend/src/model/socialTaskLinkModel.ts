import mongoose from "mongoose";

const socialTaskLinkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        facebookUrl: {
            type: String,
            default: ""
        },
        instagramUrl: {
            type: String,
            default: ""
        },
        tiktokUrl: {
            type: String,
            default: ""
        },
        youtubeUrl: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

export const SocialTaskLinkModel = mongoose.model("SocialTaskLink", socialTaskLinkSchema);
