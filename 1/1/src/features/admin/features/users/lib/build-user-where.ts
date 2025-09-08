import type { Prisma } from "@/lib/_generated/prisma"

import type { AdminFetchActionOptions } from "@/features/admin/types"

/**
 * Build where clause for user filtering in admin interface
 * Supports filtering by user number, user name, and guest name
 * Used by the users table to filter results based on search parameters
 */
export function buildUserWhere(
  search: AdminFetchActionOptions["search"],
): Prisma.UserWhereInput {
  const fromDate = search.from ? new Date(search.from) : undefined
  const toDate = search.to ? new Date(search.to) : undefined

  return {
    // Multi-field search: user name, user email, or guest name
    ...(search.name && {
      OR: [
        // Search by user name
        {
          name: {
            contains: search.name.trim(),
            mode: "insensitive",
          },
        },
        // Search by user email
        {
          email: {
            contains: search.name.trim(),
            mode: "insensitive",
          },
        },
        // Search by user phone
        {
          phone: {
            contains: search.name.trim(),
            mode: "insensitive",
          },
        },
      ],
    }),

    // Date range filters for user creation date
    ...(fromDate || toDate
      ? {
          createdAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
          },
        }
      : {}),
  }
}
