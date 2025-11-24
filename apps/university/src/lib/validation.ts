import { z } from "zod";

export const kycSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  documentNumber: z.string().min(1, "Document number is required"),
  frontImage: z
    .any()
    .refine((file) => file?.length > 0, "Front image is required"),
  backImage: z
    .any()
    .refine((file) => file?.length > 0, "Back image is required"),
});

export const bankSchema = z
  .object({
    holderName: z.string().min(1, "Account holder name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    confirmAccountNumber: z
      .string()
      .min(1, "Confirm account number is required"),
    ifscCode: z.string().optional(),
    bankName: z.string().min(1, "Bank name is required"),
    qrUrl: z.string().optional(),
    branchName: z.string().min(1, "Branch name is required"),
    accountType: z.string().min(1, "Account type is required"),
    // kycDocument: z.string().min(1, "KYC document is required"),
    relation: z.string().min(1, "Relation is required"),
  })
  .refine((data) => data.accountNumber === data.confirmAccountNumber, {
    message: "Account numbers don't match",
    path: ["confirmAccountNumber"],
  });

export const panSchema = z.object({
  panNumber: z
    .string()
    .min(1, "PAN number is required")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
  panImage: z
    .any()
    .refine((file) => file?.length > 0, "PAN card image is required"),
});

export type KYCFormData = z.infer<typeof kycSchema>;
export type BankFormData = z.infer<typeof bankSchema>;
export type PanFormData = z.infer<typeof panSchema>;
