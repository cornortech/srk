import mongoose from 'mongoose';

export interface IPaymentMetadata extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  bankStatementId: mongoose.Types.ObjectId;
  remarks: string;
  referenceNumber: string;
  receiptId?: string;
  paymentAmount?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentMetadataSchema = new mongoose.Schema(
  {
    bankStatementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankStatement',
      required: true,
      index: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    referenceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    receiptId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentAmount: {
      type: Number,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // for any additional flexible data
    },
  },
  {
    timestamps: true,
  }
);

const PaymentMetaDataModel = mongoose.model(
  'PaymentMetadata',
  paymentMetadataSchema
);
export default PaymentMetaDataModel;
