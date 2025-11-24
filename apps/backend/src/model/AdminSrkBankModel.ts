import mongoose from "mongoose";

const srkBankSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    totalPendingPayout: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AdminSrkBankModel = mongoose.model("AdminSrkBank", srkBankSchema);
