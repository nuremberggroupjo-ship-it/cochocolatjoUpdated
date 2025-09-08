"use server"

import { ActionReturn, CartInfo } from "@/types"

import {
  revalidateCartCache,
  revalidateProductCache,
} from "@/lib/helpers/cache-revalidate"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

import { updateCartPrices } from "@/features/cart/actions/update-cart-prices.action"

/**
 * Add product to cart
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
): Promise<ActionReturn<CartInfo>> {
  try {
    // verify sessionCartId exists
    const { sessionCartId, userId, sessionFavoriteId } =
      await getCurrentSessionInfo()
    if (!sessionCartId) {
      return { success: false, message: "Session not found" }
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, name: true },
    })

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    if (product.stock < quantity) {
      return { success: false, message: "Not enough stock available" }
    }

    await prisma.$transaction(async (tx) => {
      // Find or create cart
      let cart = await tx.cart.findFirst({
        where: userId ? { userId } : { sessionCartId },
      })

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId,
            sessionCartId,
          },
        })
      }

      // Check if item already exists in cart
      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      })

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity
        if (product.stock < newQuantity) {
          return { success: false, message: "Not enough stock available" }
        }

        await tx.cartItem.update({
          where: { cartId_productId: { cartId: cart.id, productId } },
          data: { quantity: newQuantity },
        })
      } else {
        // Create new cart item
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        })
      }

      // Update cart prices after modifying items
      await updateCartPrices(cart.id, tx)
    })

    // Revalidate cache
    revalidateProductCache(userId, sessionCartId, sessionFavoriteId)
    revalidateCartCache(userId, sessionCartId)

    return {
      success: true,
      message: `${product.name} added to cart successfully`,
    }
  } catch (error) {
    console.log("Error adding to cart:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add to cart",
    }
  }
}
