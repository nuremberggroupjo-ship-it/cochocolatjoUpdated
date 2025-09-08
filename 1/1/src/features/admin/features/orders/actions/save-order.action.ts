"use server"

import { revalidateTag } from "next/cache"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getOrderByIdAdmin } from "@/data"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { saveOrderSchema } from "@/features/admin/features/orders/lib/order.schema"

/**
 * Server action to update order status information
 * Only allows updates for order status, payment status, and delivery status
 * Requires admin authentication for security
 */
export const saveOrderAction = actionClient
  .metadata({
    actionName: "saveOrderAction",
  })
  .inputSchema(saveOrderSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .bindArgsSchemas<[existingId: z.ZodString]>([z.string()])
  .action(async ({ parsedInput, bindArgsClientInputs }) => {
    // Verify admin session for security
    await verifySession({ isAdmin: true })

    const existingId = bindArgsClientInputs[0]
    const { id, status, isPaid, isDelivered } = parsedInput

    // Verify the order exists
    const existingOrder = await getOrderByIdAdmin(existingId)
    if (!existingOrder) {
      throw new Error(API_RESPONSE_MESSAGES.NOT_FOUND("Order", existingId))
    }

    // Ensure the ID matches (additional security check)
    if (id !== existingId) {
      throw new Error("Order ID mismatch")
    }

    // Prepare update data with timestamp logic
    const updateData: {
      status: typeof status
      isPaid: boolean
      isDelivered: boolean
      paidAt?: Date | null
      deliveredAt?: Date | null
    } = {
      status,
      isPaid,
      isDelivered,
    }

    // Handle paidAt timestamp
    if (isPaid && !existingOrder.isPaid) {
      // Order was just marked as paid - set paidAt to now
      updateData.paidAt = new Date()
    } else if (!isPaid && existingOrder.isPaid) {
      // Order was unmarked as paid - clear paidAt
      updateData.paidAt = null
    }
    // If isPaid status didn't change, don't modify paidAt

    // Handle deliveredAt timestamp
    if (isDelivered && !existingOrder.isDelivered) {
      // Order was just marked as delivered - set deliveredAt to now
      updateData.deliveredAt = new Date()
    } else if (!isDelivered && existingOrder.isDelivered) {
      // Order was unmarked as delivered - clear deliveredAt
      updateData.deliveredAt = null
    }
    // If isDelivered status didn't change, don't modify deliveredAt

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: existingId },
      data: updateData,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        isPaid: true,
        paidAt: true,
        isDelivered: true,
        deliveredAt: true,
      },
    })

    // Revalidate cache
    revalidateTag(REVALIDATE_TAGS.ORDERS)

    return {
      message: API_RESPONSE_MESSAGES.UPDATED_SUCCESS(
        `Order ${existingOrder.orderNumber}`,
      ),
      result: {
        updatedOrder,
      },
    }
  })
