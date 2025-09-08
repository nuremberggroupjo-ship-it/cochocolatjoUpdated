"use server"

import { ActionReturn, FavoriteInfo } from "@/types"

import { getProductByIdPublic } from "@/data"

import { revalidateProductCache } from "@/lib/helpers/cache-revalidate"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

/**
 * Add product to favorites
 */
export async function addToFavorites(
  productId: string,
): Promise<ActionReturn<FavoriteInfo>> {
  try {
    // verify sessionFavoriteId exists
    const { sessionFavoriteId, userId, sessionCartId } =
      await getCurrentSessionInfo()
    if (!sessionFavoriteId) {
      return { success: false, message: "Session not found" }
    }

    // Verify product exists and is active
    const product = await getProductByIdPublic(productId)
    if (!product) {
      return { success: false, message: "Product not found" }
    }

    // If logged in
    if (userId) {
      // For authenticated users: use upsert with userId composite key
      await prisma.favorite.upsert({
        where: {
          favorite_user_product_unique: {
            userId,
            productId,
          },
        },
        create: {
          userId,
          productId,
          sessionFavoriteId,
        },
        update: {}, // No updates needed
      })
    } else {
      // For guests: use upsert with sessionFavoriteId composite key
      await prisma.favorite.upsert({
        where: {
          favorite_session_product_unique: {
            sessionFavoriteId,
            productId,
          },
        },
        create: {
          userId: null,
          productId,
          sessionFavoriteId,
        },
        update: {}, // No updates needed
      })
    }

    revalidateProductCache(userId, sessionFavoriteId, sessionCartId)

    return {
      success: true,
      result: { isFavorite: true },
      message: `${product.name} added to your favorites`,
    }
  } catch (error) {
    console.error("addToFavorites error:", error)
    return {
      success: false,
      result: { isFavorite: false },
      message: "Failed to add to favorites",
    }
  }
}
