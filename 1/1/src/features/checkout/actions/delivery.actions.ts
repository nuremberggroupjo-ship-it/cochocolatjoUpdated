"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { flattenValidationErrors } from "next-safe-action"
import { z } from "zod"

import { getCheckoutCartData } from "@/data"

import { getCurrentUserInfo } from "@/lib/dal"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"
import { actionClient } from "@/lib/safe-action"

import { API_RESPONSE_MESSAGES, REVALIDATE_TAGS } from "@/constants"

import { generateOrderNumber } from "@/features/checkout/lib/utils"
import { AddressSchema } from "@/features/checkout/schemas/address.schema"
import {
  type DeliveryInfoFormData,
  deliveryInfoSchema,
} from "@/features/checkout/schemas/delivery.schema"

export const saveDeliveryInfo = actionClient
  .metadata({
    actionName: "saveDeliveryInfo",
  })
  .inputSchema(deliveryInfoSchema, {
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

    if (!cartSummary || !sessionCartId) {
      throw new Error(API_RESPONSE_MESSAGES.NOT_FOUND("Cart"))
    }

    if (!userInfo) {
      throw new Error("User not authenticated")
    }

    // Store delivery info in cookies for the next step
    const cookieStore = await cookies()
    cookieStore.set("deliveryInfo", JSON.stringify(parsedInput), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return {
      success: true,
      data: parsedInput,
      message: "Delivery information saved successfully",
    }
  })

/**
 * Create delivery order
 * This action creates the final order with delivery information
 */
export const createDeliveryOrder = actionClient
  .metadata({
    actionName: "createDeliveryOrder",
  })
  .inputSchema(
    z.object({
      deliveryInfo: deliveryInfoSchema,
    }),
    {
      handleValidationErrorsShape: async (ve) =>
        flattenValidationErrors(ve).fieldErrors,
    },
  )
  .action(async ({ parsedInput }) => {
    const [cartSummary, user, { sessionCartId }] = await Promise.all([
      getCheckoutCartData(),
      getCurrentUserInfo(),
      getCurrentSessionInfo(),
    ])

    if (!user) {
      throw new Error("User not authenticated")
    }
    if (user?.paymentMethod === "VISA") {
      throw new Error(
        "VISA payment method is currently unavailable. Please select a different payment method.",
      )
    }

    if (!cartSummary || !sessionCartId) {
      throw new Error("No cart data found")
    }

    // Calculate delivery cost (you can customize this logic)
    const itemsPrice = cartSummary.itemsPrice
    const shippingPrice = cartSummary.shippingPrice
    const taxPrice = 0
    const totalPrice = itemsPrice + shippingPrice + taxPrice
    const { deliveryInfo } = parsedInput
    const userAddresses = user.addresses as AddressSchema[]
    const selectedAddress = userAddresses.find(
      (address) => address?.id === deliveryInfo.selectedAddressId,
    )

    // Create order in database transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: "PENDING",
          deliveryType: "DELIVERY",
          paymentMethod: user.paymentMethod, // Default for delivery
          itemsPrice: itemsPrice,
          shippingPrice: shippingPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
          userId: user.id,
          additionalNotes: deliveryInfo.additionalNotes || "",
          guestName: deliveryInfo.name,
          guestEmail: deliveryInfo.email || "",
          guestPhone: deliveryInfo.phone,
           is_gift : deliveryInfo.isGift || false, 
    date: deliveryInfo.date ? new Date(deliveryInfo.date) : null,
          shippingAddress: {
            id: selectedAddress?.id || userAddresses[0]?.id || "",
            name: selectedAddress?.name || userAddresses[0]?.name || "",
            city: selectedAddress?.city || userAddresses[0]?.city || "",
            area: selectedAddress?.area || userAddresses[0]?.area || "",
            street: selectedAddress?.street || userAddresses[0]?.street || "",
            buildingNumber:
              selectedAddress?.buildingNumber ||
              userAddresses[0]?.buildingNumber ||
              "",
            apartmentNumber:
              selectedAddress?.apartmentNumber ||
              userAddresses[0]?.apartmentNumber ||
              "",
          },
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

      // Create order items and update stock
      for (const item of cartSummary.items) {
        // Update product stock
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
      if (user.id && deliveryInfo.phone) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            phone: deliveryInfo.phone,
          },
        })
      }

      // Clear cart after successful order
      if (cartSummary.id) {
        await prisma.cart.delete({
          where: { id: cartSummary.id },
        })
      }

      return newOrder
    })

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
 * Get delivery info from cookies
 * Returns parsed delivery info or null if not found/invalid
 */
export const getDeliveryInfo =
  async (): Promise<DeliveryInfoFormData | null> => {
    try {
      const cookieStore = await cookies()
      const deliveryInfoCookie = cookieStore.get("deliveryInfo")

      if (!deliveryInfoCookie?.value) {
        return null
      }

      // Parse and validate the delivery info
      const deliveryInfo = JSON.parse(deliveryInfoCookie.value)

      // Basic validation to ensure required fields exist
      if (!deliveryInfo.name || !deliveryInfo.email || !deliveryInfo.phone) {
        console.warn(
          "Delivery info missing required fields, removing invalid cookie",
        )
        cookieStore.delete("deliveryInfo")
        return null
      }

      return deliveryInfo as DeliveryInfoFormData
    } catch (error) {
      console.error("Error getting delivery info:", error)

      // If JSON parsing fails, clear the corrupted cookie
      try {
        const cookieStore = await cookies()
        cookieStore.delete("deliveryInfo")
      } catch (cleanupError) {
        console.error(
          "Error cleaning up corrupted delivery info cookie:",
          cleanupError,
        )
      }

      return null
    }
  }
