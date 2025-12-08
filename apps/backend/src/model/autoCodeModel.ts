import mongoose from 'mongoose';

export interface IAutoCode extends mongoose.Document {
  code: string;
  userId: mongoose.Types.ObjectId;
  targetApp: 'task' | 'bank'; // Which app the code is for
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const autoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetApp: {
      type: String,
      enum: ['task', 'bank'],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index - automatically delete expired codes after 60 seconds past expiration
autoCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

export const AutoCodeModel = mongoose.model<IAutoCode>('AutoCode', autoCodeSchema);
