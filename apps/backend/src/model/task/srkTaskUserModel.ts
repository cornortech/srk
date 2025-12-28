import mongoose from 'mongoose';

export interface ISrkTaskUserModel extends mongoose.Document {
  srkUniversityUserId: string;
  fullName: string;
  dob: string;
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const srkTaskUserSchema = new mongoose.Schema(
  {
    srkUniversityUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'srkUniversityUser',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const srkTaskUserModel = mongoose.model<ISrkTaskUserModel>(
  'srkTaskUser',
  srkTaskUserSchema
);
