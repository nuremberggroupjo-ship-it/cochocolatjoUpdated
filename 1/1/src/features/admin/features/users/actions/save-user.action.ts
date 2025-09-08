"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getUserByIdAdmin } from "@/data"

import { verifySession } from "@/lib/dal"
import { env } from "@/lib/env"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { saveUserSchema } from "@/features/admin/features/users/lib/user.schema"

/**
 * Server action to update user role
 * Only allows role updates for security reasons
 * Requires admin authentication
 */
export const saveUserAction = actionClient
  .metadata({
    actionName: "saveUserAction",
  })
  .inputSchema(saveUserSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[existingId: z.ZodString]>([z.string()])
  .action(async ({ parsedInput, bindArgsClientInputs }) => {
    // Verify admin session for security
    await verifySession({ isAdmin: true })

    const existingId = bindArgsClientInputs[0]
    const { id, role } = parsedInput

    // Verify the user exists
    const existingUser = await getUserByIdAdmin(existingId)
    if (!existingUser) {
      throw new Error(API_RESPONSE_MESSAGES.NOT_FOUND("User", existingId))
    }

    // Ensure the ID matches (additional security check)
    if (id !== existingId) {
      throw new Error("User ID mismatch")
    }

    const adminEmail = env.ADMIN_EMAIL.split(",") || []
    if (adminEmail.includes(existingUser.email)) {
      throw new Error("Cannot change role of this super admin user")
    }

    try {
      // Check if role is changing from ADMIN to USER (security-critical change)
      const isRoleDowngrade = existingUser.role === "ADMIN" && role === "USER"

      // Update the user role
      const updatedUser = await prisma.user.update({
        where: { id: existingId },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })

      // 🔥 SECURITY: If user role changed from ADMIN to USER, invalidate all their sessions
      // This prevents them from continuing to access admin features with their existing session
      if (isRoleDowngrade) {
        try {
          // Delete all sessions for this user from the database
          await prisma.session.deleteMany({
            where: { userId: existingId },
          })

          console.log(
            `🔒 Security: All sessions invalidated for user ${existingId} due to role downgrade`,
          )
        } catch (sessionError) {
          console.error(
            "Failed to invalidate sessions after role downgrade:",
            sessionError,
          )
          // Don't throw here - the role update was successful, session cleanup is secondary
        }
      }

      // Revalidate cache - this will force server-side components to refresh
      revalidateTag(REVALIDATE_TAGS.USERS)

      return {
        result: { ...updatedUser, roleChanged: isRoleDowngrade },
        message: isRoleDowngrade
          ? `${updatedUser.name}'s role updated to USER. All sessions have been invalidated for security.`
          : API_RESPONSE_MESSAGES.UPDATED_SUCCESS(`${updatedUser.name}'s role`),
      }
    } catch (error) {
      console.error("saveUserAction: Error updating user", {
        error: error instanceof Error ? error.message : error,
        userId: existingId,
        newRole: role,
      })

      throw new Error("Failed to update user role")
    }
  })
