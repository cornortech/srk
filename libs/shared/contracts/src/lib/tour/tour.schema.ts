import { features } from "process";
import { z } from "zod";

export const getUserTourSchema = z.array(
  z.object({
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    tourBalance: z.number(),
    tourEventWallet: z.number(),
  })
);

export const getActiveTourAchievementsSchema = z.array(
  z.object({
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    collectedAmount: z.number(),
  })
);

export const getTourTargetSchema = z.array(
  z.object({
    _id: z.string(),
    destination: z.string(),
    description: z.string(),
    targetAmount: z.number(),
    currentAmount: z.number(),
    duration: z.number(),
    accommodation: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    rating: z.number().min(0).max(5),
    image: z.string(),
    features: z.array(z.string()),
    isActive: z.boolean(),
    collectedAmount: z.number(),
    createdAt: z.string(),
  })
);

// Used for both create and edit. `image` is an https URL, an emoji, an existing
// storage key, or (when uploading) an image data URL that the upload middleware
// swaps for a storage key before validation runs.
export const createTourTargetSchema = z.object({
  destination: z.string().trim().min(1, "Destination is required").max(120),
  description: z.string().trim().min(1, "Description is required").max(2000),
  targetAmount: z.number().positive("Target amount must be more than 0"),
  // Number of days users have to reach the target
  duration: z.number().int().min(1, "Duration must be at least 1 day").max(3650),
  accommodation: z.string().trim().min(1, "Accommodation is required").max(120),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  rating: z.number().min(0).max(5),
  image: z.string().max(2048).default(""),
  features: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  // Only used on create. The target becomes the one users earn towards.
  isActive: z.boolean().optional(),
});

export const setTourTargetActiveSchema = z.object({
  isActive: z.boolean(),
});

export const tourTargetResponseSchema = z.object({
  _id: z.string(),
  destination: z.string(),
  description: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  duration: z.number(),
  accommodation: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  rating: z.number().min(0).max(5),
  image: z.string(),
  features: z.array(z.string()),
});
