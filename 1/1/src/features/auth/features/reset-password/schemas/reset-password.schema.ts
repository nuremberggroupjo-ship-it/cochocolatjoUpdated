import { z } from "zod"

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Invalid token"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>