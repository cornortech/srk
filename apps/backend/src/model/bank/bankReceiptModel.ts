
import mongoose from "mongoose";

export interface IBankReceipt extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  url: string;
  publicId?: string;
  createdFor: mongoose.Types.ObjectId;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const bankReceiptSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
    createdFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMetadata",
      required: true,
      index: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);
    
const BankReceiptModel = mongoose.model("BankReceipt", bankReceiptSchema);

export default BankReceiptModel;