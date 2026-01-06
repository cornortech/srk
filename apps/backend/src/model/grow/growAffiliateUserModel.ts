import mongoose from 'mongoose';

export interface IGrowAffiliateUser extends mongoose.Document {
  fullName: string;
  email: string;
  gender: string;
  srkUniversityUserId: mongoose.Schema.Types.ObjectId;
  promocode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const growAffiliateUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
    },
    promocode: {
      type: String,
      required: true,
      unique: true,
    },
    srkUniversityUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const GrowAffiliateUserModel = mongoose.model<IGrowAffiliateUser>(
  'growAffiliateUser',
  growAffiliateUserSchema
);

export default GrowAffiliateUserModel;
