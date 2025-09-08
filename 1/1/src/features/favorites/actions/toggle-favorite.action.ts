"use server"

import { ActionReturn, FavoriteInfo } from "@/types"

import { addToFavorites } from "@/features/favorites/actions/add-to-favorites.action"
import { getFavoriteStatus } from "@/features/favorites/actions/get-favorite-status.action"
import { removeFromFavorites } from "@/features/favorites/actions/remove-from-favorites.action"

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  productId: string,
): Promise<ActionReturn<FavoriteInfo>> {
  try {
    // First check current status
    const statusResult = await getFavoriteStatus(productId)

    if (!statusResult.success) {
      return statusResult
    }

    // Toggle based on current status
    if (statusResult.result?.isFavorite) {
      return await removeFromFavorites(productId)
    } else {
      return await addToFavorites(productId)
    }
  } catch (error) {
    console.error("toggleFavorite error:", error)
    return {
      success: false,
      result: { isFavorite: false },
      message: "Failed to toggle favorite",
    }
  }
}
