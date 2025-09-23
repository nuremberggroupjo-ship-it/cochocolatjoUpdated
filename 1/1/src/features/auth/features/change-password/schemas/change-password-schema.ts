import { z } from "zod"

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm the new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>