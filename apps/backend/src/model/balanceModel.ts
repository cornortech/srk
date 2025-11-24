import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // that can be withdrawn
    balance: {
      type: Number,
      default: 0,
    },
    // wallet + event bonus
    totalEarnings: {
      type: Number,
      default: 0,
    },
    // money that is received from my lower level users
    srkBonus: {
      type: Number,
      default: 0,
    },
    // money given to upper level users can't withdraw
    eventWallet: {
      type: Number,
      default: 0,
    },
    tourBalance: {
      type: Number,
      default: 0,
    },
    totalWithdraw: {
      type: Number,
      default: 0,
    },
    totalTds: {
      type: Number,
      default: 0,
    },
    tourEventWallet: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const balanceModel = mongoose.model("Balance", balanceSchema);
