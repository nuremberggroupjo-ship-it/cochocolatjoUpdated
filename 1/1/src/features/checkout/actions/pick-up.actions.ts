"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { flattenValidationErrors } from "next-safe-action"

import { getCheckoutCartData } from "@/data"

import { getCurrentUserInfo } from "@/lib/dal"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { generateUniqueOrderNumber } from "@/features/checkout/lib/utils"
import {
  type PickupInfoSchema,
  pickupInfoSchema,
} from "@/features/checkout/schemas/pickup-info.schema"

/**
 * Save pickup info to session/state
 * This action saves pickup information for the order review step
 */
export const savePickupInfo = actionClient
  .metadata({
    actionName: "savePickupInfo",
  })
  .inputSchema(pickupInfoSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    // Get cartSummary and user/session info
    const [cartSummary, userInfo, { sessionCartId }] = await Promise.all([
      getCheckoutCartData(),
      getCurrentUserInfo(),
      getCurrentSessionInfo(),
    ])

    

    // Get current cart data
    if (!cartSummary || !sessionCartId) {
      throw new Error(API_RESPONSE_MESSAGES.NOT_FOUND("Cart"))
    }

    if (userInfo) {
      await prisma.user.update({
        where: { id: userInfo.id },
        data: {
          phone: parsedInput.phone,
        },
      })
    }

    // Store pickup info in cookies for the next step
    const cookieStore = await cookies()
    cookieStore.set("pickupInfo", JSON.stringify(parsedInput), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    })

    return {
      success: true,
      data: parsedInput,
      message: "Pickup information saved successfully",
    }
  })

/**
 * Create pickup order
 * This action creates the final order with pickup information
 */
export const createPickupOrder = actionClient
  .metadata({
    actionName: "createPickupOrder",
  })
  .inputSchema(pickupInfoSchema, {
    handleValidationErrorsShape: async (ve) =>
      flattenValidationErrors(ve).fieldErrors,
  })
  .action(async ({ parsedInput }) => {
    // Get current cart data
    const [cartSummary, { userId, sessionCartId }] = await Promise.all([
      getCheckoutCartData(),
      getCurrentSessionInfo(),
    ])

    if (!cartSummary || !sessionCartId) {
      throw new Error(API_RESPONSE_MESSAGES.NOT_FOUND("Cart"))
    }

    // Calculate totals (no shipping for pickup)
    const itemsPrice = cartSummary.itemsPrice
    const shippingPrice = cartSummary.shippingPrice
    const taxPrice = 0
    const totalPrice = itemsPrice + shippingPrice + taxPrice

    // Create order in database transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const orderNumber = await generateUniqueOrderNumber()
      const newOrder = await tx.order.create({
        data: {
          orderNumber: orderNumber,
          status: "PENDING",
          deliveryType: "PICKUP",
          paymentMethod: "CASH_ON_DELIVERY", // Default for pickup
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          isPaid: false,
          isDelivered: false,
          additionalNotes: parsedInput.additionalNotes,
          // Guest info for pickup
          guestName: parsedInput.name,
          guestPhone: parsedInput.phone,
          guestEmail: parsedInput.email || null,
          is_gift : parsedInput.isGift || false, 
    date: parsedInput.date ? new Date(parsedInput.date) : null,
          // User info if authenticated
          userId: userId || null,
          // Order items
          orderItems: {
            create: cartSummary.items.map((item) => ({
              quantity: item.quantity,
              price:
                item.product.isDiscountActive && item.product.discountPrice
                  ? item.product.discountPrice
                  : item.product.price,
              name: item.product.name,
              slug: item.product.slug,
              image: item.product.productImages[0]?.imageUrl || "",
              productId: item.product.id,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      })

      // Update product stock quantities
      for (const item of cartSummary.items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Save phone number for signed-in users
      if (userId && parsedInput.phone) {
        await tx.user.update({
          where: { id: userId },
          data: {
            phone: parsedInput.phone,
          },
        })
      }

      // // Clear cart after successful order
      if (cartSummary.id) {
        await prisma.cart.delete({
          where: { id: cartSummary.id },
        })
      }

      return newOrder
    })

    // Clear pickup info cookie
    const cookieStore = await cookies()
    if (userId) {
      // Extend cookie for authenticated users (convenience for repeat orders)
      cookieStore.set("pickupInfo", JSON.stringify(parsedInput), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days for logged-in users
      })
    } else {
      // Delete for guest users (privacy)
      cookieStore.delete("pickupInfo")
    }

    // Revalidate product and order data immediately
    revalidateTag(REVALIDATE_TAGS.PRODUCTS)
    revalidateTag(REVALIDATE_TAGS.ORDERS)

    // Don't revalidate cart immediately - let the success page handle it
    // This prevents interference with onSuccess callback and navigation

    return {
      success: true,
      orderNumber: order.orderNumber,
      message: "Order created successfully",
      cartSessionId: sessionCartId, // Include this so we can revalidate later if needed
    }
  })

/**
 * Get pickup info from cookies
 */
export const getPickupInfo = async (): Promise<PickupInfoSchema | null> => {
  try {
    const cookieStore = await cookies()
    const pickupInfoCookie = cookieStore.get("pickupInfo")

    if (!pickupInfoCookie) {
      return null
    }

    const pickupInfo = JSON.parse(pickupInfoCookie.value)
    return pickupInfo
  } catch (error) {
    console.error("Error getting pickup info:", error)
    return null
  }
}
