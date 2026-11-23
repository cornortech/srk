import mongoose from 'mongoose';

const contentLeaderSchema = new mongoose.Schema(
  {
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContentSubmission',
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Only the top 3 of each week are rewarded
    rank: { type: Number, required: true, min: 1, max: 3 },
    // R2 key of the post screenshot/image shown on the leaderboard
    postImage: { type: String },
    // Amount credited to the user's earnings when selected (0 = none)
    rewardAmount: { type: Number, default: 0, min: 0, max: 500 },
    // Week the leader was chosen for (Nepal dates, YYYY-MM-DD, inclusive)
    weekStart: { type: String, required: true },
    weekEnd: { type: String, required: true },
  },
  { timestamps: true }
);

contentLeaderSchema.index({ weekStart: 1, weekEnd: 1, rank: 1 }, { unique: true });
contentLeaderSchema.index({ weekStart: -1 });

export const ContentLeaderModel = mongoose.model(
  'ContentLeader',
  contentLeaderSchema
);
