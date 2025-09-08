import { unstable_cache } from "next/cache"

import type { GetEntitiesOptions, GetEntitiesResult } from "@/types"
import type { UserAdminData } from "@/types/db"
import { getUserDataSelect } from "@/types/db"

import type { Prisma, UserRole } from "@/lib/_generated/prisma"
import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Get users with pagination, filtering, and sorting for admin interface
 * Requires admin authentication
 * Uses Next.js unstable_cache for better performance with revalidation tags
 *
 * @param options - Query options including pagination, filtering, and sorting
 * @returns Promise with users data and total count
 */
export const getUsers = async (
  options: GetEntitiesOptions<
    Prisma.UserWhereInput,
    Prisma.UserOrderByWithRelationInput
  > = {},
): Promise<GetEntitiesResult<UserAdminData> & { total: number }> => {
  // Verify admin session for security
  await verifySession({ isAdmin: true })

  const {
    limit,
    offset,
    where = {},
    orderBy = [{ updatedAt: "desc" }],
  } = options

  return unstable_cache(
    async () => {
      try {
        // Execute queries in parallel for better performance
        const [users, total] = await Promise.all([
          prisma.user.findMany({
            select: getUserDataSelect(),
            where,
            orderBy,
            ...(limit && { take: limit }),
            ...(offset && { skip: offset }),
          }),
          prisma.user.count({ where }),
        ])

        return {
          data: users as UserAdminData[],
          total,
        }
      } catch (error) {
        console.error("getUsers: Error fetching users", {
          error: error instanceof Error ? error.message : error,
          options,
        })

        if (process.env.NODE_ENV === "production") {
          return { data: [], total: 0 }
        }

        throw new Error("Failed to fetch users")
      }
    },
    [
      "users",
      `limit-${limit}`,
      `offset-${offset}`,
      JSON.stringify(orderBy),
      JSON.stringify(where),
    ],
    {
      tags: [REVALIDATE_TAGS.USERS],
      revalidate: 3600, // Cache for 1 hour
    },
  )()
}

/**
 * Admin version for management interfaces
 * Fetches users without count for better performance when count is not needed
 */
export const getUsersAdmin = async (
  options: Omit<
    GetEntitiesOptions<
      Prisma.UserWhereInput,
      Prisma.UserOrderByWithRelationInput
    >,
    "includeCount"
  > = {},
): Promise<UserAdminData[]> => {
  const result = await getUsers(options)
  return result.data
}

/**
 * Admin version for management interfaces with count
 * Used for paginated tables that need total count
 */
export const getUsersAdminWithCount = async (
  options: Omit<
    GetEntitiesOptions<
      Prisma.UserWhereInput,
      Prisma.UserOrderByWithRelationInput
    >,
    "includeCount"
  > = {},
): Promise<GetEntitiesResult<UserAdminData> & { total: number }> => {
  return await getUsers(options)
}

/**
 * Build where clause for user filtering
 * Supports filtering by name, email, role, and email verification status
 *
 * @param searchTerm - General search term to filter by name or email
 * @param role - Filter by specific role (USER or ADMIN)
 * @param emailVerified - Filter by email verification status
 * @returns Prisma where clause
 */
export function buildUserWhere(
  searchTerm?: string,
  role?: UserRole,
  emailVerified?: boolean,
): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {}

  // General search across name and email
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { email: { contains: searchTerm, mode: "insensitive" } },
    ]
  }

  // Role filter
  if (role) {
    where.role = role
  }

  // Email verification filter
  if (typeof emailVerified === "boolean") {
    where.emailVerified = emailVerified
  }

  return where
}

/**
 * Build order by clause for user sorting
 * Supports sorting by common user fields
 *
 * @param field - Field to sort by
 * @param direction - Sort direction (asc or desc)
 * @returns Prisma order by clause
 */
export function buildUserOrderBy(
  field: keyof UserAdminData = "updatedAt",
  direction: "asc" | "desc" = "desc",
): Prisma.UserOrderByWithRelationInput[] {
  return [{ [field]: direction }]
}
