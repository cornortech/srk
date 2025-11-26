import mongoose from "mongoose";

const socialTaskFollowRequestSchema = new mongoose.Schema(
  {
    followedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    socialMedia: {
      type: String,
      enum: ["facebook", "instagram", "tiktok", "youtube"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    screenshotUrl: {
      type: String,
      require: true
    },
    rejectionReason: {
      type: String
    }
  },
  { timestamps: true }
);

export const SocialTaskFollowRequestModel = mongoose.model("SocialTaskFollowRequest", socialTaskFollowRequestSchema);
