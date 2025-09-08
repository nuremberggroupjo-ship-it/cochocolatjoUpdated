// src/features/admin/features/banners/data/get-banner-by-slug.ts
import { unstable_cache } from "next/cache"

import { Banner } from "@/lib/_generated/prisma"
import prisma from "@/lib/prisma"

type GetBannerBySlugOptions = {
  slug: string
  includeInactive?: boolean
}

/**
 * Retrieves a banner from the database based on its slug with caching.
 * Optimized for both public banner display and admin forms.
 *
 * @param {string} slug - The slug of the banner to retrieve
 * @param {boolean} includeInactive - Whether to include inactive banners (for admin)
 * @returns {Promise<Banner | null>} The banner data or null if not found
 */
export const getBannerBySlug = async ({
  slug,
  includeInactive = false,
}: GetBannerBySlugOptions): Promise<Banner | null> => {
  // Early return for invalid input
  if (!slug || slug.trim() === "") {
    console.warn("getBannerBySlug: No valid slug provided.")
    return null
  }

  // Special case for "new" slug (admin form)
  if (slug === "new") {
    return null
  }

  try {
    // Use caching for better performance
    return await unstable_cache(
      async () => {
        return await prisma.banner.findUnique({
          where: {
            slug: slug.trim(),
            // Only include active banners for public pages
            ...(!includeInactive && { isActive: true }),
          },
        })
      },
      [`banner-by-slug-${slug}`, includeInactive ? "admin" : "public"],
      {
        tags: ["banners", `banner-${slug}`],
        revalidate: includeInactive ? 300 : 3600, // Admin: 5 min, Public: 1 hour
      },
    )()
  } catch (error) {
    console.error("getBannerBySlug: Error fetching banner by slug", {
      slug,
      error: error instanceof Error ? error.message : error,
    })

    // Don't throw in production for better UX
    if (process.env.NODE_ENV === "production") {
      return null
    }

    throw new Error(`Failed to fetch banner with slug: ${slug}`)
  }
}

/**
 * Simplified version for cases where you only need the slug parameter
 * Maintains backward compatibility with existing code
 */
export const getBannerBySlugSimple = async (
  slug: string,
): Promise<Banner | null> => {
  return getBannerBySlug({ slug })
}

/**
 * Admin version that includes inactive banners
 * Used in admin forms and management interfaces
 */
export const getBannerBySlugAdmin = async (
  slug: string,
): Promise<Banner | null> => {
  return getBannerBySlug({ slug, includeInactive: true })
}

/**
 * Public version that only returns active banners
 * Used in public-facing banner display
 */
export const getBannerBySlugPublic = async (
  slug: string,
): Promise<Banner | null> => {
  return getBannerBySlug({ slug, includeInactive: false })
}
