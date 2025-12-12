import z from "zod";

export const createGrowSocialMediaEnrollementSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    socialMediaPlatform: z.enum(["Instagram", "TikTok", "YouTube", "Twitter", "Facebook"]),
    profileLink: z.string().url("Invalid URL format"),
    packageId: z.string().min(1, "Package ID is required"),
});