import mongoose from "mongoose";

const socialTaskBalanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    totalEarnings: {
        type: Number,
        default: 0,
    },
},
    {
        timestamps: true,
    }
);

export const SocialTaskBalanceModel = mongoose.model("SocialTaskBalance", socialTaskBalanceSchema);
