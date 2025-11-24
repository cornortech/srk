import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    packageId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "inactive"],
    },
    purchasedAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionModel = mongoose.model("Subscription", userSchema);
