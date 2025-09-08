import { unstable_cache } from "next/cache"

import type { GetEntitiesOptions, GetEntitiesResult } from "@/types"
import type { CustomerOrderData } from "@/types/db"
import { getCustomerOrderDataSelect } from "@/types/db"

import type { OrderStatus, Prisma } from "@/lib/_generated/prisma"
import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { convertToPlainObject } from "@/lib/utils"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Get customer orders with pagination, filtering, and sorting
 * Only returns orders belonging to the authenticated customer
 * Uses Next.js unstable_cache for better performance with revalidation tags
 *
 * @param options - Query options including pagination, filtering, and sorting
 * @returns Promise with customer orders data and total count
 */
export const getCustomerOrders = async (
  options: GetEntitiesOptions<
    Prisma.OrderWhereInput,
    Prisma.OrderOrderByWithRelationInput
  > = {},
): Promise<GetEntitiesResult<CustomerOrderData> & { total: number }> => {
  // Verify customer session for security
  const { user } = await verifySession()

  const {
    limit,
    offset,
    where = {},
    orderBy = [{ createdAt: "desc" }],
  } = options

  // Ensure customer can only see their own orders
  const customerWhere: Prisma.OrderWhereInput = {
    ...where,
    userId: user.id, // Security: Only customer's orders
  }

  return unstable_cache(
    async () => {
      try {
        // Execute queries in parallel for better performance
        const [orders, total] = await Promise.all([
          prisma.order.findMany({
            select: getCustomerOrderDataSelect(),
            where: customerWhere,
            orderBy,
            ...(limit && { take: limit }),
            ...(offset && { skip: offset }),
          }),
          prisma.order.count({ where: customerWhere }),
        ])

        return {
          data: convertToPlainObject(orders) as CustomerOrderData[],
          total,
        }
      } catch (error) {
        console.error("getCustomerOrders: Error fetching customer orders", {
          error: error instanceof Error ? error.message : error,
          userId: user.id,
          options,
        })

        if (process.env.NODE_ENV === "production") {
          return { data: [], total: 0 }
        }

        throw new Error("Failed to fetch customer orders")
      }
    },
    [
      "customer-orders",
      user.id, // User-specific cache
      `limit-${limit}`,
      `offset-${offset}`,
      JSON.stringify(orderBy),
      JSON.stringify(where),
    ],
    {
      tags: [REVALIDATE_TAGS.ORDERS, `customer-orders-${user.id}`],
      revalidate: 1800, // Cache for 30 minutes
    },
  )()
}

/**
 * Customer version for order history interface with count
 * Used for paginated tables that need total count
 */
export const getCustomerOrdersWithCount = async (
  options: GetEntitiesOptions<
    Prisma.OrderWhereInput,
    Prisma.OrderOrderByWithRelationInput
  > = {},
): Promise<GetEntitiesResult<CustomerOrderData> & { total: number }> => {
  return await getCustomerOrders(options)
}

/**
 * Build where clause for customer order filtering
 * Supports filtering by order number and status
 * Used by the customer order history table to filter results
 *
 * @param searchTerm - Search term to filter by order number
 * @param status - Filter by order status
 * @returns Prisma where clause
 */
export function buildCustomerOrderWhere(
  searchTerm?: string,
  status?: OrderStatus,
): Prisma.OrderWhereInput {
  return {
    // Search by order number (partial match)
    ...(searchTerm && {
      orderNumber: {
        contains: searchTerm.trim(),
        mode: "insensitive",
      },
    }),

    // Filter by status
    ...(status && { status }),
  }
}

/**
 * Build order by clause for customer order sorting
 * Supports sorting by common order fields
 *
 * @param field - Field to sort by
 * @param direction - Sort direction (asc or desc)
 * @returns Prisma order by clause
 */
export function buildCustomerOrderBy(
  field: keyof CustomerOrderData = "createdAt",
  direction: "asc" | "desc" = "desc",
): Prisma.OrderOrderByWithRelationInput[] {
  return [{ [field]: direction }]
}
