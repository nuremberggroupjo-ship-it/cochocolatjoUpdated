"use server"

import { ActionReturn, FavoriteInfo } from "@/types"

import { getProductByIdPublic } from "@/data"

import { revalidateProductCache } from "@/lib/helpers/cache-revalidate"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

/**
 * Remove product from favorites
 */
export async function removeFromFavorites(
  productId: string,
): Promise<ActionReturn<FavoriteInfo>> {
  try {
    // Verify product exists and is active
    const product = await getProductByIdPublic(productId)
    if (!product) {
      return { success: false, message: "Product not found" }
    }

    const { userId, sessionFavoriteId, sessionCartId } =
      await getCurrentSessionInfo()

    // Delete using deleteMany to handle OR conditions
    const deletedFavorite = await prisma.favorite.deleteMany({
      where: {
        productId,
        OR: [
          ...(userId ? [{ userId }] : []),
          { sessionFavoriteId, userId: null },
        ],
      },
    })

    revalidateProductCache(userId, sessionFavoriteId, sessionCartId)

    return {
      success: true,
      result: { isFavorite: false },
      message:
        deletedFavorite.count > 0
          ? `${product.name} removed from favorites`
          : `${product.name} was not in favorites`,
    }
  } catch (error) {
    console.error("removeFromFavorites error:", error)
    return {
      success: false,
      result: { isFavorite: true },
      message: "Failed to remove from favorites",
    }
  }
}
