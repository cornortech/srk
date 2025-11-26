import mongoose from "mongoose";

const taskSocialLinksSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
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

export const taskSocialLinkModel = mongoose.model("TaskSocialLinks", taskSocialLinksSchema);
