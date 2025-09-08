import { unstable_cache } from "next/cache"

import type { GetEntitiesOptions, GetEntitiesResult } from "@/types"
import type { OrderTableData } from "@/types/db"
import { getOrderTableDataSelect } from "@/types/db"

import type { Prisma } from "@/lib/_generated/prisma"
import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { convertToPlainObject } from "@/lib/utils"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Get orders with pagination, filtering, and sorting for admin interface
 * Requires admin authentication
 * Uses Next.js unstable_cache for better performance with revalidation tags
 *
 * @param options - Query options including pagination, filtering, and sorting
 * @returns Promise with orders data and total count
 */
export const getOrders = async (
  options: GetEntitiesOptions<
    Prisma.OrderWhereInput,
    Prisma.OrderOrderByWithRelationInput
  > = {},
): Promise<GetEntitiesResult<OrderTableData> & { total: number }> => {
  // Verify admin session for security
  await verifySession({ isAdmin: true })

  const {
    limit,
    offset,
    where = {},
    orderBy = [{ createdAt: "desc" }],
  } = options

  return unstable_cache(
    async () => {
      try {
        // Execute queries in parallel for better performance
        const [orders, total] = await Promise.all([
          prisma.order.findMany({
            select: getOrderTableDataSelect(),
            where,
            orderBy,
            ...(limit && { take: limit }),
            ...(offset && { skip: offset }),
          }),
          prisma.order.count({ where }),
        ])

        return {
          data: convertToPlainObject(orders) as OrderTableData[],
          total,
        }
      } catch (error) {
        console.error("getOrders: Error fetching orders", {
          error: error instanceof Error ? error.message : error,
          options,
        })

        if (process.env.NODE_ENV === "production") {
          return { data: [], total: 0 }
        }

        throw new Error("Failed to fetch orders")
      }
    },
    [
      REVALIDATE_TAGS.ORDERS,
      `limit-${limit}`,
      `offset-${offset}`,
      JSON.stringify(orderBy),
      JSON.stringify(where),
    ],
    {
      tags: [REVALIDATE_TAGS.ORDERS],
      revalidate: 3600, // Cache for 1 hour
    },
  )()
}

/**
 * Admin version for management interfaces
 * Fetches orders without count for better performance when count is not needed
 */
export const getOrdersAdmin = async (
  options: GetEntitiesOptions<
    Prisma.OrderWhereInput,
    Prisma.OrderOrderByWithRelationInput
  > = {},
): Promise<OrderTableData[]> => {
  const result = await getOrders(options)
  return result.data
}

/**
 * Admin version for management interfaces with count
 * Used for paginated tables that need total count
 */
export const getOrdersAdminWithCount = async (
  options: GetEntitiesOptions<
    Prisma.OrderWhereInput,
    Prisma.OrderOrderByWithRelationInput
  > = {},
): Promise<GetEntitiesResult<OrderTableData> & { total: number }> => {
  return await getOrders(options)
}
