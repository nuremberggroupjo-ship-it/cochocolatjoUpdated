import { z } from "zod"

// Schema for logging in a user
export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormType = z.infer<typeof loginFormSchema>
