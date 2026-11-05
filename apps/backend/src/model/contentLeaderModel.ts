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
    rank: { type: Number, required: true, min: 1 },
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
