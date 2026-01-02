"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growSrkAffiliateVerificationModel = void 0;
var mongoose_1 = require("mongoose");
var srkGrowAffiliateVerificationSchema = new mongoose_1.default.Schema({
    srkUniversityUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    verificationImageUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: "pending"
    },
    rejectionReason: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.growSrkAffiliateVerificationModel = mongoose_1.default.model("srkGrowAffiliateVerification", srkGrowAffiliateVerificationSchema);
