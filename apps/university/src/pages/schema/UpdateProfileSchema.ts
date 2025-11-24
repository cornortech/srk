import { z } from "zod";
import { userSchema } from "./SignUpSchema";

export const updateProfileSchema = userSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  country: true,
  dateOfBirth: true,
  contactDetail: true,
  gender: true,
  isActive: true,
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
