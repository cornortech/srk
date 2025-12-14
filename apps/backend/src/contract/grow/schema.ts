import z from "zod";

export const createGrowSocialMediaEnrollementSchema = z.object({
    userData: z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
        gender: z.enum(["Male", "Female", "Other"]),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
        country: z.string().min(1, "Country is required"),
        kycURL: z.string().url("Invalid KYC URL"),
        status: z.enum(["verificationPending", "portalActivated", "verificationRejected"]).default("verificationPending"),
        promoCode: z.string().min(1),
        referredBy: z.string().optional(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
    enrollementData: z.object({
        growSocialMediaPackageUserId: z.string(),
        growSocialMediaPackageId: z.string(),
        growSocialMediaPackageTypeId: z.string(),
        growSocialMediaPackageSubTypeId: z.string(),
        profileLinkURL: z.string().url("Invalid Profile Link URL"),
        isActive: z.boolean().default(false),
    }),
    paymentData: z.object({
        growPackageEnrollementId: z.string().min(1, "Enrollment ID is required"),
        paymentURL: z.string().url("Invalid payment URL"),
        transactionId: z.string().min(1, "Transaction ID is required"),
        paymentMethod: z.enum(["esewa", "khalti", "bankTransfer"]),
        status: z.enum(["approved", "pending", "rejected"]).default("pending"),
    }),
});

export const validateGrowUserPromoCodeSchema = z.object({
    promoCode: z.string().min(1, "Promo code is required"),
    growSocialMediaPackageId: z.string().min(1, "Package ID is required"),
});

export const validateGrowUserPromoCodeResponseSchema = z.object({
    discountDetails: z.object({
        originalAmount: z.number().min(0),
        discountPercentage: z.number().min(0).max(100),
        discountAmount: z.number().min(0),
        finalAmountAfterDiscount: z.number().min(0),
    }),
});