import mongoose from "mongoose";

const taskFollowRequestSchema = new mongoose.Schema(
  {
    followedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    followedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
  },
  { timestamps: true }
);

export const taskFollowRequestModel = mongoose.model("TaskFollowRequest", taskFollowRequestSchema);
