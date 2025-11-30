import { z } from 'zod';

// ---- Family Details ----
export const familyDetailsSchema = z.object({
  fatherName: z
    .string()
    .trim()
    .min(1, "Father's name is required")
    .max(100, "Father's name cannot exceed 100 characters"),
  motherName: z
    .string()
    .trim()
    .min(1, "Mother's name is required")
    .max(100, "Mother's name cannot exceed 100 characters"),
  spouseName: z
    .string()
    .trim()
    .max(100, "Spouse's name cannot exceed 100 characters")
    .optional(),
  childrenNames: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Child name cannot be empty')
        .max(100, 'Child name cannot exceed 100 characters')
    )
    .optional(),
});

// ---- Address ----
export const addressSchema = z.object({
  country: z
    .string()
    .trim()
    .min(1, 'Country is required')
    .max(50, 'Country cannot exceed 50 characters'),
  province: z
    .string()
    .trim()
    .min(1, 'Province is required')
    .max(50, 'Province cannot exceed 50 characters'),
  district: z
    .string()
    .trim()
    .min(1, 'District is required')
    .max(50, 'District cannot exceed 50 characters'),
  municipality: z
    .string()
    .trim()
    .min(1, 'Municipality is required')
    .max(100, 'Municipality cannot exceed 100 characters'),
  wardNo: z
    .string()
    .trim()
    .min(1, 'Ward number is required')
    .max(10, 'Ward number cannot exceed 10 characters'),
  street: z
    .string()
    .trim()
    .min(1, 'Street is required')
    .max(100, 'Street cannot exceed 100 characters'),
});

// ---- Identification Details ----
export const identificationDetailsSchema = z.object({
  idNumber: z
    .string()
    .trim()
    .min(1, 'ID number is required')
    .max(30, 'ID number cannot exceed 30 characters'),
  idType: z
    .string()
    .trim()
    .min(1, 'ID type is required')
    .max(50, 'ID type cannot exceed 50 characters'),
  issuedDate: z.date().min(new Date(1900, 0, 1), 'Invalid issue date'),
  expiryDate: z.date().min(new Date(1900, 0, 1), 'Invalid expiry date'),
  issuedFrom: z
    .string()
    .trim()
    .min(1, 'Issued from is required')
    .max(100, 'Issued from cannot exceed 100 characters'),
  nidAuthority: z
    .string()
    .trim()
    .min(1, 'NID authority is required')
    .max(100, 'NID authority cannot exceed 100 characters'),
});

// ---- Documents ----
export const documentsSchema = z.object({
  ppSizePhoto: z
    .string()
    .trim()
    .url('Invalid photo URL')
    .min(1, 'Passport size photo is required'),
  nationalIdCard: z
    .string()
    .trim()
    .url('Invalid national ID card URL')
    .min(1, 'National ID card is required'),
});

// ---- Main Bank Details Schema ----
export const bankDetailsSchema = z.object({
  srkBankId: z.string().trim().min(1, 'SRK Bank ID is required'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long.'),
  familyDetails: familyDetailsSchema,
  permanentAddress: addressSchema,
  currentAddress: addressSchema,
  identificationDetails: identificationDetailsSchema.extend({
    issuedDate: z.string().transform((date) => new Date(date)),
    expiryDate: z.string().transform((date) => new Date(date)),
  }),
  documents: documentsSchema,
});

// ---- Export Inferred Types ----
export type BankDetailsInput = z.infer<typeof bankDetailsSchema>;
export type FamilyDetails = z.infer<typeof familyDetailsSchema>;
export type Address = z.infer<typeof addressSchema>;
export type IdentificationDetails = z.infer<typeof identificationDetailsSchema>;
export type Documents = z.infer<typeof documentsSchema>;
