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
  })
);

export const createTourTargetSchema = z.object({
  destination: z.string(),
  description: z.string(),
  targetAmount: z.number(),
  duration: z.number(),
  accommodation: z.string(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  rating: z.number().min(0).max(5),
  image: z.string(),
  features: z.array(z.string()).optional(),
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
