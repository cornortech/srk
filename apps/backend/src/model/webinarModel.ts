import mongoose from 'mongoose';

const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    meetUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WebinarModel = mongoose.model('Webinar', webinarSchema);
