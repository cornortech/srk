import mongoose from "mongoose";

const affiliateRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
    },
    rejectionReason: {
      type: String,
    },
    requestedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const affiliateRequestModel = mongoose.model(
  "AffiliateRequest",
  affiliateRequestSchema
);
