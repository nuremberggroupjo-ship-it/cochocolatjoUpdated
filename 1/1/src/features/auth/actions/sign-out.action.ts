"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import {
  revalidateCartCache,
  revalidateProductCache,
} from "@/lib/helpers/cache-revalidate"
import generateNewSessionIds from "@/lib/helpers/generate-new-session-ids"
import prisma from "@/lib/prisma"

export async function handleSignOut(userId: string) {
  try {
    const cookieStore = await cookies()
    const sessionFavoriteId = cookieStore.get("sessionFavoriteId")?.value
    const sessionCartId = cookieStore.get("sessionCartId")?.value

    if (sessionFavoriteId) {
      // Only delete guest favorites (userId: null)
      await prisma.favorite.deleteMany({
        where: {
          sessionFavoriteId,
          userId: null,
        },
      })
    }

    if (sessionCartId) {
      // Only delete guest cart items (userId: null)
      await prisma.$transaction(async (tx) => {
        const guestCart = await tx.cart.findFirst({
          where: {
            sessionCartId,
            userId: null,
          },
        })

        if (guestCart) {
          await tx.cartItem.deleteMany({
            where: { cartId: guestCart.id },
          })

          await tx.cart.delete({
            where: { id: guestCart.id },
          })
        }
      })
    }

    // Generate NEW session IDs after merging to avoid conflicts
    await generateNewSessionIds()

    // Clear pickup cookies
    cookieStore.delete("pickupInfo")
    cookieStore.delete("deliveryInfo")

    // Invalidate all product caches
    revalidateProductCache(userId, sessionCartId, sessionFavoriteId)
    revalidateCartCache(userId, sessionCartId)

    revalidatePath("/", "layout") // Force revalidation of layout

    return { success: true }
  } catch (error) {
    console.error("Error during sign-out cleanup:", error)
    return { success: false }
  }
}
