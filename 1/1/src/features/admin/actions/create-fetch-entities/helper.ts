// src/features/admin/actions/utils/build-where.util.ts
import { Prisma } from "@/lib/_generated/prisma"

import { AdminFetchActionOptions } from "@/features/admin/types"

export function buildBasicWhere<T extends { name?: string; updatedAt?: Date }>(
  search: AdminFetchActionOptions["search"],
): T {
  const fromDate = search.from ? new Date(search.from) : undefined
  const toDate = search.to ? new Date(search.to) : undefined

  return {
    // Name filter - case insensitive contains
    ...(search.name && {
      name: {
        contains: search.name.trim(),
        mode: "insensitive",
      },
    }),
    // Date range filters
    ...(fromDate || toDate
      ? {
          updatedAt: {
            ...(fromDate && { gte: fromDate }),
            ...(toDate && { lte: toDate }),
          },
        }
      : {}),
  } as T
}
type SortItem = AdminFetchActionOptions["search"]["sort"][0]

// Generic orderBy builder
export function buildGenericOrderBy<T>(
  search: AdminFetchActionOptions["search"],
  customSortHandlers?: Record<string, (sort: SortItem) => T>,
): T[] {
  if (search.sort.length === 0) return []

  return search.sort.map((item) => {
    // Check if there's a custom handler for this field
    if (customSortHandlers && customSortHandlers[item.id]) {
      return customSortHandlers[item.id](item)
    }

    // Default: simple field sorting
    return {
      [item.id]: item.desc ? "desc" : "asc",
    } as T
  })
}

// Product-specific orderBy builder
export function buildProductOrderBy(
  search: AdminFetchActionOptions["search"],
): Prisma.ProductOrderByWithRelationInput[] {
  return buildGenericOrderBy<Prisma.ProductOrderByWithRelationInput>(search, {
    // Custom handlers for special fields
    category: (sort) => ({
      category: {
        name: sort.desc ? "desc" : "asc",
      },
    }),
    // Add more custom handlers as needed
  })
}
