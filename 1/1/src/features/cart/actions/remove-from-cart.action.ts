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
 * Remove product from cart
 */
export async function removeFromCart(
  productId: string,
): Promise<ActionReturn<CartInfo>> {
  try {
    const { userId, sessionCartId, sessionFavoriteId } =
      await getCurrentSessionInfo()
    if (!sessionCartId) {
      return { success: false, message: "Session not found" }
    }

    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    })

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findFirst({
        where: userId ? { userId } : { sessionCartId },
      })

      if (!cart) return

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
      })

      // Update cart prices after removing items
      await updateCartPrices(cart.id, tx)
    })

    revalidateProductCache(userId, sessionCartId, sessionFavoriteId)
    revalidateCartCache(userId, sessionCartId)

    return {
      success: true,
      message: `${product.name} removed from cart successfully`,
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return { success: false, message: "Failed to remove from cart" }
  }
}
