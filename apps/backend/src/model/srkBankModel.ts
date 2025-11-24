import mongoose from "mongoose";

const srkBankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    bankDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankDetails",
    },
  },
  {
    timestamps: true,
  }
);

export const SrkBankModel = mongoose.model("SrkBank", srkBankSchema);

// personal details  - name , phone number
// family details - father name , mother name , spouse name , children names
// address details  - permanent address, current address
// identification details - type of id , id number , issued date , issued from , nid authority
// documents  - pp size photo , national identity card
