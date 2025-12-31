import mongoose from 'mongoose';

const growPackageEngagementPostSchema = new mongoose.Schema(
  {
    growSocialMediaPackageEnrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'growSocialMediaPackageEnrollment',
      required: true,
    },
    postURLs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const growPackageEngagementPostModel = mongoose.model(
  'growPackageEngagementPost',
  growPackageEngagementPostSchema
);
