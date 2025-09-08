// src/features/admin/features/attributes/data/get-attribute-by-slug.ts
import { unstable_cache } from "next/cache"

import { Attribute } from "@/lib/_generated/prisma"
import prisma from "@/lib/prisma"

type GetAttributeBySlugOptions = {
  slug: string
  includeProducts?: boolean // Option to include related products
}

/**
 * Retrieves an attribute from the database based on its slug with caching.
 * Optimized for both public attribute pages and admin forms.
 *
 * @param {string} slug - The slug of the attribute to retrieve
 * @param {boolean} includeProducts - Whether to include related products
 * @returns {Promise<Attribute | null>} The attribute data or null if not found
 */
export const getAttributeBySlug = async ({
  slug,
  includeProducts = false,
}: GetAttributeBySlugOptions): Promise<Attribute | null> => {
  // Early return for invalid input
  if (!slug || slug.trim() === "") {
    console.warn("getAttributeBySlug: No valid slug provided.")
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
        return await prisma.attribute.findUnique({
          where: {
            slug: slug.trim(),
          },
          ...(includeProducts && {
            include: {
              products: {
                include: {
                  product: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      isActive: true,
                    },
                  },
                },
                where: {
                  product: {
                    isActive: true, // Only include active products in public view
                  },
                },
              },
            },
          }),
        })
      },
      [
        `attribute-by-slug-${slug}`,
        includeProducts ? "with-products" : "simple",
      ],
      {
        tags: ["attributes", `attribute-${slug}`],
        revalidate: 3600, // 1 hour
      },
    )()
  } catch (error) {
    console.error("getAttributeBySlug: Error fetching attribute by slug", {
      slug,
      error: error instanceof Error ? error.message : error,
    })

    // Don't throw in production for better UX
    if (process.env.NODE_ENV === "production") {
      return null
    }

    throw new Error(`Failed to fetch attribute with slug: ${slug}`)
  }
}

/**
 * Simplified version for cases where you only need the slug parameter
 * Maintains backward compatibility with existing code
 */
export const getAttributeBySlugSimple = async (
  slug: string,
): Promise<Attribute | null> => {
  return getAttributeBySlug({ slug })
}

/**
 * Admin version for management interfaces
 * Used in admin forms and management interfaces
 */
export const getAttributeBySlugAdmin = async (
  slug: string,
): Promise<Attribute | null> => {
  return getAttributeBySlug({ slug })
}

/**
 * Public version with related products
 * Used in public-facing attribute pages with product listings
 */
export const getAttributeBySlugWithProducts = async (
  slug: string,
): Promise<Attribute | null> => {
  return getAttributeBySlug({ slug, includeProducts: true })
}
