import z from "zod";

export const createGrowSocialMediaEnrollementSchema = z.object({
    userData: z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        gender: z.enum(["Male", "Female", "Other"]),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
        country: z.string().min(1, "Country is required"),
        kycURL: z.string().url("Invalid KYC URL"),
        usedPromoCode: z.string().optional(),
    }),
    enrollementData: z.object({
        growSocialMediaPackageId: z.string(),
        growSocialMediaPackageTypeId: z.string(),
        growSocialMediaPackageSubTypeId: z.string(),
        profileLinkURL: z.string().url("Invalid Profile Link URL"),
    }),
    paymentData: z.object({
        paymentURL: z.string().url("Invalid payment URL"),
        transactionId: z.string().min(1, "Transaction ID is required"),
        paymentMethod: z.enum(["esewa", "khalti", "bankTransfer"]),
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