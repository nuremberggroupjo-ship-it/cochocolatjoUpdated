// src/data/products/get-product-by-slug.ts
import { unstable_cache } from "next/cache"

import { ProductData, getProductDataSelect } from "@/types/db"

import { Prisma } from "@/lib/_generated/prisma"
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

type GetProductBySlugOptions = {
  slug: string
  where?: Prisma.ProductWhereUniqueInput
  includeInactive?: boolean
  includeFavorites?: boolean
  includeCart?: boolean
}

/**
 * Retrieves a product from the database based on its slug with caching.
 * Optimized for both public product pages and admin forms.
 *
 * @param {string} slug - The slug of the product to retrieve
 * @param {Prisma.ProductWhereUniqueInput} where - Additional where conditions
 * @param {boolean} includeInactive - Whether to include inactive products (for admin)
 * @param {boolean} includeFavorites - Whether to include favorite data
 * @param {boolean} includeCart - Whether to include cart data
 * @returns {Promise<ProductData | null>} The product data or null if not found
 */
export const getProductBySlug = async ({
  slug,
  where,
  includeInactive = false,
  includeFavorites = false,
  includeCart = false,
}: GetProductBySlugOptions): Promise<ProductData | null> => {
  // Early return for invalid input
  if (!slug || slug.trim() === "") {
    console.warn("getProductBySlug: No valid slug provided.")
    return null
  }

  // Special case for "new" slug (admin form)
  if (slug === "new") {
    return null
  }

  try {
    // Get user session info if including favorites or cart
    let userId: string | undefined
    let sessionFavoriteId: string | undefined
    let sessionCartId: string | undefined

    if (includeFavorites || includeCart) {
      const sessionInfo = await getCurrentSessionInfo()
      userId = sessionInfo.userId

      // Only get session IDs if we're including them specifically
      if (includeFavorites) {
        sessionFavoriteId = sessionInfo.sessionFavoriteId
      }
      if (includeCart) {
        sessionCartId = sessionInfo.sessionCartId
      }
    }

    // Create user cache key when including favorites or cart
    const userCacheKey =
      includeFavorites || includeCart
        ? userId
          ? `user-${userId}`
          : `session-${
              includeFavorites && includeCart
                ? `${sessionFavoriteId}-${sessionCartId}`
                : includeFavorites
                  ? sessionFavoriteId
                  : sessionCartId
            }` || "anonymous"
        : "no-user"

    // Use caching for better performance
    return await unstable_cache(
      async () => {
        return await prisma.product.findUnique({
          where: {
            slug: slug.trim(),
            // Only include active products for public pages
            ...(!includeInactive && { isActive: true }),
            ...where,
          },
          select: getProductDataSelect(
            userId,
            sessionFavoriteId,
            sessionCartId,
          ),
        })
      },
      [
        `product-by-slug-${slug}`,
        includeInactive ? "admin" : "public",
        `favorites-${includeFavorites}`,
        `cart-${includeCart}`,
        userCacheKey, // Add user context to cache key
      ],
      {
        tags: [
          REVALIDATE_TAGS.PRODUCTS,
          `product-${slug}`,
          ...(includeFavorites || includeCart
            ? [`products-${userCacheKey}`]
            : []), // Add user-specific tag
        ],
        revalidate: includeInactive ? 300 : 3600,
      },
    )()
  } catch (error) {
    console.error("getProductBySlug: Error fetching product by slug", {
      slug,
      error: error instanceof Error ? error.message : error,
    })

    if (process.env.NODE_ENV === "production") {
      return null
    }

    throw new Error(`Failed to fetch product with slug: ${slug}`)
  }
}
/**
 * Admin version that includes inactive products
 * Used in admin forms and management interfaces
 */
export const getProductBySlugAdmin = async (
  slug: string,
): Promise<ProductData | null> => {
  return getProductBySlug({ slug, includeInactive: true })
}

/**
 * Public version that only returns active products
 * Used in public-facing product pages
 */
export const getProductBySlugPublic = async (
  slug: string,
): Promise<ProductData | null> => {
  return getProductBySlug({
    slug,
    includeInactive: false,
    includeFavorites: true,
    includeCart: true,
  })
}
