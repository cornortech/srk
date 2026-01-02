"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowSrkAffiliateEarningPayoutModel = void 0;
var mongoose_1 = require("mongoose");
var growSrkAffiliateEarningPayoutSchema = new mongoose_1.default.Schema({
    srkGrowUserId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'growSocialMediaPackageUser',
        required: true,
    },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    transactionId: { type: String },
    paidAt: { type: Date },
    rejectionReason: { type: String },
    paymentUrl: { type: String },
}, { timestamps: true });
exports.GrowSrkAffiliateEarningPayoutModel = mongoose_1.default.model('GrowSrkAffiliateEarningPayout', growSrkAffiliateEarningPayoutSchema);
