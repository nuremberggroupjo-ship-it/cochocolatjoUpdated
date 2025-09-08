import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"

import type { CustomerOrderDetailsData } from "@/types/db"
import { getCustomerOrderDetailsSelect } from "@/types/db"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { convertToPlainObject } from "@/lib/utils"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Get customer order details by order number
 * Returns complete order information for customer view
 * Security: Only allows customers to view their own orders
 *
 * @param orderNumber - Order number (string)
 * @returns Promise with complete order details or throws notFound
 */
export const getCustomerOrderByOrderNumber = async (
  orderNumber: string,
): Promise<CustomerOrderDetailsData> => {
  // Verify customer session for security
  const { user } = await verifySession()

  return unstable_cache(
    async () => {
      try {
        const order = await prisma.order.findFirst({
          where: {
            orderNumber,
            userId: user.id, // Security: Only customer's orders
          },
          select: getCustomerOrderDetailsSelect(),
        })

        if (!order || order.user?.id !== user.id) {
          notFound()
        }

        return convertToPlainObject(order) as CustomerOrderDetailsData
      } catch (error) {
        console.error("getCustomerOrderByOrderNumber: Error fetching order", {
          error: error instanceof Error ? error.message : error,
          orderNumber,
          userId: user.id,
        })

        if (process.env.NODE_ENV === "production") {
          notFound()
        }

        throw new Error(`Failed to fetch order with number: ${orderNumber}`)
      }
    },
    [`customer-order-details-${orderNumber}-${user.id}`],
    {
      tags: [
        REVALIDATE_TAGS.ORDERS,
        `customer-orders-${user.id}`,
        `order-details-${orderNumber}`,
      ],
      revalidate: 300, // Cache for 5 minutes (for real-time status updates)
    },
  )()
}
