"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growSocialMediaPackagePaymentModel = void 0;
var mongoose_1 = require("mongoose");
var growSocialMediaPackagePaymentSchema = new mongoose_1.default.Schema({
    growPackageEnrollmentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "growSocialMediaPackageEnrollment",
        required: true,
    },
    paymentURL: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["esewa", "khalti", "bankTransfer"],
        required: true,
    },
    status: {
        type: String,
        enum: ["approved", "pending", "rejected"],
        default: "pending",
    },
    rejectionReason: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
});
exports.growSocialMediaPackagePaymentModel = mongoose_1.default.model("growSocialMediaPackagePayment", growSocialMediaPackagePaymentSchema);
