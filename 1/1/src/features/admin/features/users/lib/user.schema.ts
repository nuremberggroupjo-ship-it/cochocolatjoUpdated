import { z } from "zod"

import { UserRole } from "@/lib/_generated/prisma"

/**
 * Schema for updating user information (admin only)
 * Currently only allows role updates for security
 */
export const saveUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: "Role must be either USER or ADMIN" }),
  }),
})

export type SaveUserSchema = z.infer<typeof saveUserSchema>
