// src/features/admin/features/categories/data/get-category-by-slug.ts
import { unstable_cache } from "next/cache"

import { Category } from "@/lib/_generated/prisma"
import prisma from "@/lib/prisma"

type GetCategoryBySlugOptions = {
  slug: string
  includeInactive?: boolean
}

/**
 * Retrieves a category from the database based on its slug with caching.
 * Optimized for both public category pages and admin forms.
 *
 * @param {string} slug - The slug of the category to retrieve
 * @param {boolean} includeInactive - Whether to include inactive categories (for admin)
 * @returns {Promise<Category | null>} The category data or null if not found
 */
export const getCategoryBySlug = async ({
  slug,
  includeInactive = false,
}: GetCategoryBySlugOptions): Promise<Category | null> => {
  // Early return for invalid input
  if (!slug || slug.trim() === "") {
    console.warn("getCategoryBySlug: No valid slug provided.")
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
        return await prisma.category.findUnique({
          where: {
            slug: slug.trim(),
            // Only include active categories for public pages
            ...(!includeInactive && { isActive: true }),
          },
        })
      },
      [`category-by-slug-${slug}`, includeInactive ? "admin" : "public"],
      {
        tags: ["categories", `category-${slug}`],
        revalidate: includeInactive ? 300 : 3600, // Admin: 5 min, Public: 1 hour
      },
    )()
  } catch (error) {
    console.error("getCategoryBySlug: Error fetching category by slug", {
      slug,
      error: error instanceof Error ? error.message : error,
    })

    // Don't throw in production for better UX
    if (process.env.NODE_ENV === "production") {
      return null
    }

    throw new Error(`Failed to fetch category with slug: ${slug}`)
  }
}

/**
 * Simplified version for cases where you only need the slug parameter
 * Maintains backward compatibility with existing code
 */
export const getCategoryBySlugSimple = async (
  slug: string,
): Promise<Category | null> => {
  return getCategoryBySlug({ slug })
}

/**
 * Admin version that includes inactive categories
 * Used in admin forms and management interfaces
 */
export const getCategoryBySlugAdmin = async (
  slug: string,
): Promise<Category | null> => {
  return getCategoryBySlug({ slug, includeInactive: true })
}

/**
 * Public version that only returns active categories
 * Used in public-facing category pages
 */
export const getCategoryBySlugPublic = async (
  slug: string,
): Promise<Category | null> => {
  return getCategoryBySlug({ slug, includeInactive: false })
}
