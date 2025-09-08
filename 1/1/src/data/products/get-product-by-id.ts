import { unstable_cache } from "next/cache"

import { ProductData, getProductDataSelect } from "@/types/db"

import { Prisma } from "@/lib/_generated/prisma"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

type GetProductByIdOptions = {
  id: string
  where?: Prisma.ProductWhereUniqueInput
  includeInactive?: boolean
  includeFavorites?: boolean
}

/**
 * Retrieves a product from the database based on its ID with caching.
 * Optimized for both public product pages and admin forms.
 *
 * @param {string} id - The ID of the product to retrieve
 * @param {Prisma.ProductWhereUniqueInput} where - Additional where conditions
 * @param {boolean} includeInactive - Whether to include inactive products (for admin)
 * @param {boolean} includeFavorites - Whether to include favorite data
 * @returns {Promise<ProductData | null>} The product data or null if not found
 */
export const getProductById = async ({
  id,
  where,
  includeInactive = false,
  includeFavorites = false,
}: GetProductByIdOptions): Promise<ProductData | null> => {
  // Early return for invalid input
  if (!id || id.trim() === "") {
    console.warn("getProductById: No valid ID provided.")
    return null
  }

  try {
    // Get user session info if including favorites
    let userId: string | undefined
    let sessionFavoriteId: string | undefined

    if (includeFavorites) {
      const sessionInfo = await getCurrentSessionInfo()
      userId = sessionInfo.userId
      sessionFavoriteId = sessionInfo.sessionFavoriteId
    }

    // Create user cache key when including favorites
    const userCacheKey = includeFavorites
      ? userId
        ? `user-${userId}`
        : `session-${sessionFavoriteId || "anonymous"}`
      : "no-user"

    // Use caching for better performance
    return await unstable_cache(
      async () => {
        return await prisma.product.findUnique({
          where: {
            id: id.trim(),
            // Only include active products for public pages
            ...(!includeInactive && { isActive: true }),
            ...where,
          },
          select: getProductDataSelect(userId, sessionFavoriteId),
        })
      },
      [
        `product-by-id-${id}`,
        includeInactive ? "admin" : "public",
        `favorites-${includeFavorites}`,
        userCacheKey, // Add user context to cache key
      ],
      {
        tags: [
          REVALIDATE_TAGS.PRODUCTS,
          `product-${id}`,
          ...(includeFavorites ? [`products-${userCacheKey}`] : []), // Add user-specific tag
        ],
        revalidate: includeInactive ? 300 : 3600,
      },
    )()
  } catch (error) {
    console.error("getProductById: Error fetching product by ID", {
      id,
      error: error instanceof Error ? error.message : error,
    })

    if (process.env.NODE_ENV === "production") {
      return null
    }

    throw new Error(`Failed to fetch product with ID: ${id}`)
  }
}

/**
 * Admin version that includes inactive products
 * Used in admin forms and management interfaces
 */
export const getProductByIdAdmin = async (
  id: string,
): Promise<ProductData | null> => {
  return getProductById({ id, includeInactive: true })
}

/**
 * Public version that only returns active products
 * Used in public-facing product pages
 */
export const getProductByIdPublic = async (
  id: string,
): Promise<ProductData | null> => {
  return getProductById({ id, includeInactive: false })
}
