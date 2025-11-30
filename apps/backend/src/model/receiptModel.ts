import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema(
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
      ref: 'PaymentMetadata',
      required: true,
      index: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

const ReceiptModel = mongoose.model('Receipt', receiptSchema);
export default ReceiptModel;