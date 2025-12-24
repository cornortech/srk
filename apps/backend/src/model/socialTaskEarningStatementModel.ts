import mongoose from "mongoose";

const socialTaskEarningStatementSchema = new mongoose.Schema(
    {
        followedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        followedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const SocialTaskEarningStatementModel = mongoose.model("SocialTaskEarningStatement", socialTaskEarningStatementSchema);
