import type { Prisma } from "@/lib/_generated/prisma"

import type { AdminFetchActionOptions } from "@/features/admin/types"

/**
 * Build where clause for products filtering in admin interface
 * Supports filtering by products name, and category name
 * Used by the products table to filter results based on search parameters
 */
export function buildProductsWhere(
  search: AdminFetchActionOptions["search"],
): Prisma.ProductWhereInput {
  const fromDate = search.from ? new Date(search.from) : undefined
  const toDate = search.to ? new Date(search.to) : undefined

  return {
    // Multi-field search: product name, and category name
    ...(search.name && {
      OR: [
        // Search by product name (partial match)
        {
          name: {
            contains: search.name.trim(),
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search.name.trim(),
              mode: "insensitive",
            },
          },
        },
      ],
    }),

    // Date range filters for product creation date
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
