import { unstable_cache } from "next/cache"

import { GetEntitiesOptions, GetEntitiesResult } from "@/types"

import { Attribute, Prisma } from "@/lib/_generated/prisma"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

interface GetAttributesOptions
  extends GetEntitiesOptions<
    Prisma.AttributeWhereInput,
    Prisma.AttributeOrderByWithRelationInput
  > {
  includeCount?: boolean
  includeProductCount?: boolean
}

/**
 * Retrieves attributes from the database with caching and filtering options.
 * Optimized for both public attribute display and admin management.
 */
export const getAttributes = async ({
  includeCount = false,
  includeProductCount = false,
  limit,
  offset,
  orderBy = [{ updatedAt: "desc" }],
  where = {},
}: GetAttributesOptions): Promise<GetEntitiesResult<Attribute>> => {
  try {
    return await unstable_cache(
      async () => {
        // Use Promise.all for concurrent execution when count is needed
        if (includeCount) {
          const [data, total] = await Promise.all([
            prisma.attribute.findMany({
              where,
              ...(includeProductCount && {
                include: {
                  _count: {
                    select: {
                      products: {
                        where: {
                          product: { isActive: true}, 
                         
                        },
                      },
                    },
                  },
                },
              }),
              orderBy,
              ...(limit && { take: limit }),
              ...(offset && { skip: offset }),
            }),
            prisma.attribute.count({
              where,
            }),
          ])

          return { data, total }
        }

        // Just get data when count is not needed
        const data = await prisma.attribute.findMany({
          where,
          ...(includeProductCount && {
            include: {
              _count: {
                select: {
                  products: {
                    where: {
                      product: {
                        isActive: true,
                        category: {
                          isActive: true, // ✅ Also filter by active categories
                        },
                      },
                    },
                  },
                },
              },
            },
          }),
          orderBy,
          ...(limit && { take: limit }),
          ...(offset && { skip: offset }),
        })

        return { data }
      },
      [
        "attributes",
        `limit-${limit}`,
        `offset-${offset}`,
        `count-${includeCount}`,
        `product-count-${includeProductCount}`,
        JSON.stringify(orderBy),
        JSON.stringify(where),
      ],
      {
        tags: [REVALIDATE_TAGS.ATTRIBUTES],
        revalidate: 3600,
      },
    )()
  } catch (error) {
    console.error("getAttributes: Error fetching attributes", {
      error: error instanceof Error ? error.message : error,
    })

    if (process.env.NODE_ENV === "production") {
      return { data: [] }
    }

    throw new Error("Failed to fetch attributes")
  }
}

/**
 * Admin version for management interfaces
 */
export const getAttributesAdmin = async (
  options: Omit<GetAttributesOptions, "includeCount"> = {},
): Promise<Attribute[]> => {
  const result = await getAttributes(options)
  return result.data
}

/**
 * Admin version for management interfaces with count
 */
export const getAttributesAdminWithCount = async (
  options: Omit<GetAttributesOptions, "includeCount"> = {},
): Promise<GetEntitiesResult<Attribute>> => {
  return getAttributes({ ...options, includeCount: true })
}

/**
 * Public version for public-facing pages
 */
export const getAttributesPublic = async (
  options: Omit<GetAttributesOptions, "includeCount"> = {},
): Promise<Attribute[]> => {
  const result = await getAttributes(options)
  return result.data
}

/**
 * Public version for public-facing pages with count
 */
export const getAttributesPublicWithCount = async (
  options: Omit<GetAttributesOptions, "includeCount"> = {},
): Promise<GetEntitiesResult<Attribute>> => {
  return getAttributes({ ...options, includeCount: true })
}

export type AttributeWithProductCount = Attribute & {
  _count: { products: number }
}

/**
 * Get attributes with product counts
 */
export const getAttributesPublicWithProductCount = async (
  options: Omit<
    GetAttributesOptions,
    "includeCount" | "includeProductCount"
  > = {},
): Promise<AttributeWithProductCount[]> => {
  const result = await getAttributes({
    ...options,

    includeProductCount: true,
    orderBy: [{ name: "asc" }],
  })
  return result.data as AttributeWithProductCount[]
}
