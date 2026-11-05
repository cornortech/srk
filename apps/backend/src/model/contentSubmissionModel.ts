import mongoose from 'mongoose';

export const CONTENT_PLATFORMS = [
  'YouTube',
  'Facebook',
  'Instagram',
  'Twitter',
  'TikTok',
] as const;

const contentSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: { type: String, enum: CONTENT_PLATFORMS, required: true },
    links: { type: [String], required: true },
    // Nepal calendar date (YYYY-MM-DD) of the submission
    dayKey: { type: String, required: true },
  },
  { timestamps: true }
);

// One submission per user per day, enforced by the database
contentSubmissionSchema.index({ userId: 1, dayKey: 1 }, { unique: true });
contentSubmissionSchema.index({ createdAt: -1 });

export const ContentSubmissionModel = mongoose.model(
  'ContentSubmission',
  contentSubmissionSchema
);
