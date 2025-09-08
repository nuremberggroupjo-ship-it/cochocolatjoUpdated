"use server"

import { ActionReturn, FavoriteInfo } from "@/types"

import { getProductByIdPublic } from "@/data"

import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

/**
 * Get favorite status for a product
 */
export async function getFavoriteStatus(
  productId: string,
): Promise<ActionReturn<FavoriteInfo>> {
  try {
    if (!productId) {
      return {
        success: false,
        result: { isFavorite: false },
        message: "Product ID is required",
      }
    }

    // Verify product exists and is active
    const product = await getProductByIdPublic(productId)
    if (!product) {
      return {
        success: false,
        result: { isFavorite: false },
        message: "Product not found",
      }
    }

    const { userId, sessionFavoriteId } = await getCurrentSessionInfo()

    const favorite = await prisma.favorite.findFirst({
      where: {
        productId,
        OR: [
          ...(userId ? [{ userId }] : []),
          { sessionFavoriteId, userId: null },
        ],
      },
      select: { id: true },
    })

    return {
      success: true,
      result: { isFavorite: !!favorite },
      message: "Status retrieved successfully",
    }
  } catch (error) {
    console.error("getFavoriteStatus error:", error)
    return {
      success: false,
      result: { isFavorite: false },
      message: "Failed to get favorite status",
    }
  }
}
