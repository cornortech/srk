import mongoose from "mongoose";

const balancePayoutSchema = new mongoose.Schema(
  {
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: {
      type: Number,
      required: true,
    },
    tdsAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    paymentProofUrl: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "bank_transfer", "khalti"],
    },
    rejectionReason: {
      type: String,
    },
    transactionNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const balancePayoutModel = mongoose.model(
  "BalancePayout",
  balancePayoutSchema
);
