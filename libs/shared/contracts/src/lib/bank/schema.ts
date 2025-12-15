import { z } from "zod";

const familyDetailsSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  spouseName: z.string().optional(),
  childrenNames: z.array(z.string()).optional(),
});

const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  municipality: z.string().min(1, "Municipality is required"),
  wardNo: z.string().min(1, "Ward number is required"),
  street: z.string().min(1, "Street is required"),
});

const identificationDetailsSchema = z.object({
  idNumber: z.string().min(1, "ID number is required"),
  idType: z.string().min(1, "ID type is required"),
  issuedDate: z.date().min(new Date(1900, 0, 1), "Invalid issue date"),
  expiryDate: z.date().min(new Date(1900, 0, 1), "Invalid expiry date"),
  issuedFrom: z.string().min(1, "Issued from is required"),
  nidAuthority: z.string().min(1, "NID authority is required"),
});

const documentsSchema = z.object({
  ppSizePhoto: z.string().url().min(1, "Passport size photo is required"),
  nationalIdCard: z.string().url().min(1, "National ID card is required"),
});

export const createBankDetailsSchema = z.object({
  familyDetails: familyDetailsSchema,
  permanentAddress: addressSchema,
  currentAddress: addressSchema,
  identificationDetails: identificationDetailsSchema,
  documents: documentsSchema,
});

export const getBankDetailsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  currentAddress: addressSchema.optional().nullable(),
  permanentAddress: addressSchema.optional().nullable(),
  identificationDetails: identificationDetailsSchema.optional().nullable(),
  documents: documentsSchema.optional().nullable(),
  familyDetails: familyDetailsSchema.optional().nullable(),
});


export const getSrkBankRequestByStatusSchema =z.array( z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  userId:z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
  }),
  requestedAt: z.date(),
}));