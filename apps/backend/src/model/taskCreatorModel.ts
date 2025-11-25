import mongoose from "mongoose";

const taskCreatorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    package: {
        type: String,
        enum: ["basic", "standard", "premium"],
        required: true
    },
    social_media_links: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        tiktok: { type: String, default: "" },
        required: true
    },
    payment_screenshot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: true
    }

}, { timestamps: true });


export const taskCreatorModel = mongoose.model("TaskCreator", taskCreatorSchema)
