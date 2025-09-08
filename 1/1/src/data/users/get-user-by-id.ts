import { unstable_cache } from "next/cache"

import type { UserAdminData } from "@/types/db"
import { getUserDataSelect } from "@/types/db"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Get a single user by ID for admin interface
 * Requires admin authentication for security
 * Uses Next.js unstable_cache for better performance with revalidation tags
 *
 * @param id - User ID to fetch
 * @returns Promise with user data or null if not found
 */
export const getUserByIdAdmin = async (
  id: string,
): Promise<UserAdminData | null> => {
  // Verify admin session for security
  await verifySession({ isAdmin: true })

  if (!id) {
    throw new Error("User ID is required")
  }

  return unstable_cache(
    async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          select: getUserDataSelect(),
        })

        return user as UserAdminData | null
      } catch (error) {
        console.log("getUserByIdAdmin: Error fetching user", {
          error: error instanceof Error ? error.message : error,
          id,
        })

        if (process.env.NODE_ENV === "production") {
          return null
        }

        throw new Error(`Failed to fetch user with ID: ${id}`)
      }
    },
    ["user", id],
    {
      tags: [REVALIDATE_TAGS.USERS],
      revalidate: 3600, // Cache for 1 hour
    },
  )()
}

/**
 * Simple version for basic user data without admin verification
 * Used for non-sensitive operations
 * Uses lighter caching since it doesn't need revalidation tags
 *
 * @param id - User ID to fetch
 * @returns Promise with basic user data or null if not found
 */
export const getUserByIdSimple = async (
  id: string,
): Promise<Pick<UserAdminData, "id" | "name" | "email"> | null> => {
  if (!id) {
    return null
  }

  return unstable_cache(
    async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            email: true,
          },
        })

        return user
      } catch (error) {
        console.error("getUserByIdSimple: Error fetching user", {
          error: error instanceof Error ? error.message : error,
          id,
        })

        return null
      }
    },
    ["user-simple", id],
    {
      revalidate: 3600, // Cache for 1 hour, no tags needed for simple data
    },
  )()
}
