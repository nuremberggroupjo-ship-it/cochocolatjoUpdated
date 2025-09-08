import { z } from "zod"

// Schema
export const emailSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  message: z
    .string()
    .min(4, { message: "Message must be at least 4 characters long" })
    .max(1000, { message: "Message must be at most 1000 characters long" })
    .nonempty({ message: "Message is required" }),
})

export type EmailSchema = z.infer<typeof emailSchema>
