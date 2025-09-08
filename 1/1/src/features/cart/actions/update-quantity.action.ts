"use server"

import { ActionReturn, CartInfo } from "@/types"

import {
  revalidateCartCache,
  revalidateProductCache,
} from "@/lib/helpers/cache-revalidate"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

import { removeFromCart } from "@/features/cart/actions/remove-from-cart.action"
import { updateCartPrices } from "@/features/cart/actions/update-cart-prices.action"

/**
 * Update product quantity in cart (increment/decrement)
 */
export async function updateQuantity(
  productId: string,
  increment: boolean,
): Promise<ActionReturn<CartInfo>> {
  try {
    const { userId, sessionCartId, sessionFavoriteId } =
      await getCurrentSessionInfo()
    if (!sessionCartId) {
      return { success: false, message: "Session not found" }
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true },
    })
    if (!product) {
      return { success: false, message: "Product not found" }
    }

    // check if cart exists
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionCartId },
      include: {
        cartItems: {
          where: { productId },
          include: {
            product: {
              select: { stock: true, name: true },
            },
          },
        },
      },
    })
    if (!cart || cart.cartItems.length === 0) {
      return { success: false, message: "Item not found in cart" }
    }

    const cartItem = cart.cartItems[0]
    const newQuantity = increment
      ? cartItem.quantity + 1
      : cartItem.quantity - 1

    if (newQuantity <= 0) {
      return await removeFromCart(productId)
    }

    // Check stock availability
    if (cartItem.product.stock < newQuantity) {
      return { success: false, message: "Not enough stock available" }
    }

    await prisma.$transaction(async (tx) => {
      await tx.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity: newQuantity },
      })

      // Update cart prices after changing quantity
      await updateCartPrices(cart.id, tx)
    })

    revalidateProductCache(userId, sessionCartId, sessionFavoriteId)
    revalidateCartCache(userId, sessionCartId)

    return {
      success: true,
      message: increment
        ? `adding one more of ${cartItem.product.name}`
        : `removing one of ${cartItem.product.name}`,
    }
  } catch (error) {
    console.error("Error updating quantity:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update quantity",
    }
  }
}
