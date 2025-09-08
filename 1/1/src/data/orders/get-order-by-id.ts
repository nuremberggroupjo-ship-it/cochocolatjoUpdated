import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"

import type { OrderAdminData } from "@/types/db"
import { getOrderDataSelect } from "@/types/db"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { convertToPlainObject } from "@/lib/utils"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Get order by ID for admin interface with full details
 * Includes user data, order items, and all order information
 * Requires admin authentication
 *
 * @param id - Order ID
 * @returns Promise with complete order data or throws notFound
 */
export const getOrderByIdAdmin = async (
  id: string,
): Promise<OrderAdminData> => {
  // Verify admin session for security
  await verifySession({ isAdmin: true })

  return unstable_cache(
    async () => {
      try {
        const order = await prisma.order.findUnique({
          where: { id },
          select: getOrderDataSelect(),
        })

        if (!order) {
          notFound()
        }

        return convertToPlainObject(order) as OrderAdminData
      } catch (error) {
        console.error("getOrderByIdAdmin: Error fetching order", {
          error: error instanceof Error ? error.message : error,
          orderId: id,
        })

        if (process.env.NODE_ENV === "production") {
          notFound()
        }

        throw new Error(`Failed to fetch order with ID: ${id}`)
      }
    },
    [`order-${id}`],
    {
      tags: [REVALIDATE_TAGS.ORDERS, `order-${id}`],
      revalidate: 3600, // Cache for 1 hour
    },
  )()
}

/**
 * Get simplified order by ID for basic operations
 * Returns essential order information without heavy relations
 *
 * @param id - Order ID
 * @returns Promise with simplified order data or throws notFound
 */
export const getOrderByIdSimple = async (id: string) => {
  // Verify admin session for security
  await verifySession({ isAdmin: true })

  return unstable_cache(
    async () => {
      try {
        const order = await prisma.order.findUnique({
          where: { id },
          select: {
            id: true,
            orderNumber: true,
            status: true,
            deliveryType: true,
            paymentMethod: true,
            totalPrice: true,
            isPaid: true,
            isDelivered: true,
            createdAt: true,
            updatedAt: true,
          },
        })

        if (!order) {
          notFound()
        }

        return order
      } catch (error) {
        console.error("getOrderByIdSimple: Error fetching order", {
          error: error instanceof Error ? error.message : error,
          orderId: id,
        })

        if (process.env.NODE_ENV === "production") {
          notFound()
        }

        throw new Error(`Failed to fetch order with ID: ${id}`)
      }
    },
    [`order-simple-${id}`],
    {
      tags: [REVALIDATE_TAGS.ORDERS, `order-${id}`],
      revalidate: 3600, // Cache for 1 hour
    },
  )()
}
