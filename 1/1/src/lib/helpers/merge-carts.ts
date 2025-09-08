"use server"

import { revalidatePath } from "next/cache"

import {
  revalidateCartCache,
  revalidateProductCache,
} from "@/lib/helpers/cache-revalidate"
import prisma from "@/lib/prisma"

import { updateCartPrices } from "@/features/cart/actions/update-cart-prices.action"

/**
 * Merge guest cart with user cart when user logs in
 * Similar to merge-favorites logic
 */
export default async function mergeCarts(
  userId: string,
  sessionCartId: string,
): Promise<{ merged: number; skipped: number } | void> {
  try {
    let merged = 0
    let skipped = 0

    await prisma.$transaction(async (tx) => {
      // Get guest cart
      const guestCart = await tx.cart.findFirst({
        where: { sessionCartId },
        include: {
          cartItems: {
            include: {
              product: {
                select: { id: true, stock: true },
              },
            },
          },
        },
      })

      if (!guestCart || guestCart.cartItems.length === 0) {
        return // No guest cart items to merge
      }

      // Find or create user cart
      let userCart = await tx.cart.findFirst({
        where: { userId },
      })

      if (!userCart) {
        userCart = await tx.cart.create({
          data: {
            userId,
            sessionCartId,
          },
        })
      }

      // Merge cart items
      for (const guestItem of guestCart.cartItems) {
        const existingUserItem = await tx.cartItem.findFirst({
          where: {
            cartId: userCart.id,
            productId: guestItem.productId,
          },
        })

        if (existingUserItem) {
          // Merge quantities, but don't exceed stock
          const combinedQuantity =
            existingUserItem.quantity + guestItem.quantity
          const maxQuantity = Math.min(
            combinedQuantity,
            guestItem.product.stock,
          )

          await tx.cartItem.update({
            where: {
              cartId_productId: {
                cartId: userCart.id,
                productId: guestItem.productId,
              },
            },
            data: { quantity: maxQuantity },
          })

          if (maxQuantity < combinedQuantity) {
            skipped += combinedQuantity - maxQuantity
          }
          merged++
        } else {
          // Add new item to user cart
          const maxQuantity = Math.min(
            guestItem.quantity,
            guestItem.product.stock,
          )

          await tx.cartItem.create({
            data: {
              cartId: userCart.id,
              productId: guestItem.productId,
              quantity: maxQuantity,
            },
          })

          if (maxQuantity < guestItem.quantity) {
            skipped += guestItem.quantity - maxQuantity
          }
          merged++
        }
      }

      // Delete guest cart and items
      await tx.cartItem.deleteMany({
        where: { cartId: guestCart.id },
      })

      await tx.cart.delete({
        where: { id: guestCart.id },
      })

      // Update user cart prices after merging
      await updateCartPrices(userCart.id, tx)
    })

    revalidateProductCache(userId, sessionCartId)
    revalidateCartCache(userId, sessionCartId)

    // Force revalidation of layout
    revalidatePath("/", "layout")

    console.log(
      `Merged cart items: ${merged} items processed, ${skipped} quantity units skipped (stock limitations)`,
    )

    return { merged, skipped }
  } catch (error) {
    console.error("Error merging carts:", error)
    throw error
  }
}
