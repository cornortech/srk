import mongoose from "mongoose";

const coursePaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentProofUrl: {
      type: String,
    },
    paymentType: {
      type: String,
      enum: ["qr", "onlinePayment"],
    },
    paymentMethod: {
      type: String,
      enum: ["khalti", "esewa", "bankTransfer"],
    },
    transactionId: {
      type: String,
    },
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QRCode",
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const CoursePaymentModel = mongoose.model(
  "CoursePayment",
  coursePaymentSchema
);
