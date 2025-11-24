import { z } from "zod";

// Base user schema
export const userSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  isActive: z.boolean().default(false),
  terms: z.boolean(),
  contactDetail: z.string().min(1, { message: "Contact detail is required" }),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date of birth",
  }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Select your gender",
  }),
  promoCode: z.string().optional(),
  purpose: z.enum(["affiliate", "study"], {
    message: "Select your purpose",
  }),
});

// Signup schema with refinements
export const signupSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    confirmPassword: true,
    country: true,
    terms: true,
    dateOfBirth: true,
    gender: true,
    promoCode: true,
    contactDetail: true,
    purpose:true
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === true, {
    message: "You must accept the terms and conditions",
    path: ["terms"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

// Login schema
export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
