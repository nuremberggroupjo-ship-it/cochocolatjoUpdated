import { revalidateProductCache } from "@/lib/helpers/cache-revalidate"
import prisma from "@/lib/prisma"

/**
 * Merges guest favorites with user favorites when user logs in
 * This ensures no favorites are lost during the authentication process
 */
export default async function mergeFavorites(
  userId: string,
  sessionFavoriteId: string,
) {
  try {
    // Get all guest favorites for this session
    const guestFavorites = await prisma.favorite.findMany({
      where: {
        sessionFavoriteId,
        userId: null, // Guest favorites
      },
      select: {
        productId: true,
        createdAt: true,
      },
    })

    if (guestFavorites.length === 0) {
      return // No guest favorites to merge
    }

    // Get existing user favorites to avoid duplicates
    const existingUserFavorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      select: {
        productId: true,
      },
    })

    const existingProductIds = new Set(
      existingUserFavorites.map((f) => f.productId),
    )

    // Filter out products that are already favorited by the user
    const favoritesToMerge = guestFavorites.filter(
      (guestFav) => !existingProductIds.has(guestFav.productId),
    )

    let merged = 0
    const skipped = guestFavorites.length - favoritesToMerge.length

    if (favoritesToMerge.length > 0) {
      // Use transaction to safely delete old and create new favorites
      await prisma.$transaction(async (tx) => {
        // First, delete the guest favorites that we're about to merge
        await tx.favorite.deleteMany({
          where: {
            sessionFavoriteId,
            userId: null,
            productId: {
              in: favoritesToMerge.map((f) => f.productId),
            },
          },
        })

        // Then create new user favorites
        await tx.favorite.createMany({
          data: favoritesToMerge.map((guestFav) => ({
            userId,
            productId: guestFav.productId,
            sessionFavoriteId, // Keep the same session ID for consistency
            createdAt: guestFav.createdAt, // Preserve original creation time
          })),
        })
      })

      merged = favoritesToMerge.length
    }

    // Delete any remaining guest favorites (duplicates that were skipped)
    const remainingDeleted = await prisma.favorite.deleteMany({
      where: {
        sessionFavoriteId,
        userId: null,
      },
    })

    // Invalidate cache to ensure UI reflects changes
    revalidateProductCache(userId, sessionFavoriteId)

    console.log(
      `Merged favorites: ${merged} added, ${skipped} skipped (duplicates), ${remainingDeleted.count} remaining deleted`,
    )

    return { merged, skipped }
  } catch (error) {
    console.error("Error merging favorites:", error)
    throw error
  }
}
