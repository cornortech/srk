import mongoose from "mongoose";

const webinarSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    hasFinished: {
      type: Boolean,
      default: false,
    },
    meetUrl: {
      type: String,
    },
    youtubeUrl: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const WebinarModel = mongoose.model("Webinar", webinarSchema);
