import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  recipientAccount: z
    .string()
    .min(2, "Recipient account must be at least 2 characters")
    .max(100),
  recipientName: z
    .string()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100),
  amount: z
    .string()
    .nonempty("Amount is required")
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, { message: "Amount must be positive" }),
  description: z.string().max(500).optional(),
});

type TCreatePaymentIntentForm = z.infer<typeof createPaymentIntentSchema>;
export type { TCreatePaymentIntentForm };