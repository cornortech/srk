import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referredTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BankModel = mongoose.model("Bank", bankSchema);
