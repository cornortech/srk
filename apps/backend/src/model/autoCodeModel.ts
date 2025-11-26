import mongoose, { Schema, Document } from 'mongoose';

export interface IAutoCode extends Document {
  code: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const AutoCodeSchema = new Schema<IAutoCode>({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index to automatically delete expired codes
AutoCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AutoCodeModel = mongoose.model<IAutoCode>('AutoCode', AutoCodeSchema);
