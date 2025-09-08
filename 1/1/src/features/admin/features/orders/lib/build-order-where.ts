import type { Prisma } from "@/lib/_generated/prisma"

import type { AdminFetchActionOptions } from "@/features/admin/types"

/**
 * Build where clause for order filtering in admin interface
 * Supports filtering by order number, user name, and guest name
 * Used by the orders table to filter results based on search parameters
 */
export function buildOrderWhere(
  search: AdminFetchActionOptions["search"],
): Prisma.OrderWhereInput {
  const fromDate = search.from ? new Date(search.from) : undefined
  const toDate = search.to ? new Date(search.to) : undefined

  return {
    // Multi-field search: order number, user name, or guest name
    ...(search.orderNumber && {
      OR: [
        // Search by order number (partial match)
        {
          orderNumber: {
            contains: search.orderNumber.trim(),
            mode: "insensitive",
          },
        },
        // Search by registered user name
        {
          user: {
            name: {
              contains: search.orderNumber.trim(),
              mode: "insensitive",
            },
          },
        },
        // Search by user email
        {
          user: {
            email: {
              contains: search.orderNumber.trim(),
              mode: "insensitive",
            },
          },
        },
        // Search by guest name
        {
          guestName: {
            contains: search.orderNumber.trim(),
            mode: "insensitive",
          },
        },
        // Search by guest email
        {
          guestEmail: {
            contains: search.orderNumber.trim(),
            mode: "insensitive",
          },
        },
      ],
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
