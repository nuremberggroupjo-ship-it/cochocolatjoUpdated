import type { Prisma } from "@/lib/_generated/prisma"

import type { AdminFetchActionOptions } from "@/features/admin/types"

/**
 * Build where clause for order history filtering in admin interface
 * Supports filtering by order history number
 * Used by the order history table to filter results based on search parameters
 */
export function buildOrderHistoryWhere(
  search: AdminFetchActionOptions["search"],
  userId?: string,
): Prisma.OrderWhereInput {
  const fromDate = search.from ? new Date(search.from) : undefined
  const toDate = search.to ? new Date(search.to) : undefined

  return {
    // Always filter by current user
    userId,
    // Multi-field search: order number, user name, or guest name
    ...(search.orderNumber && {
      orderNumber: {
        contains: search.orderNumber.trim(),
        mode: "insensitive",
      },
    }),

    // Date range filters for order creation date
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
