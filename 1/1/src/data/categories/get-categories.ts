// src/data/categories/get-categories.ts
import { unstable_cache } from "next/cache"

import { GetEntitiesOptions, GetEntitiesResult } from "@/types"

import { Category, Prisma } from "@/lib/_generated/prisma"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

interface GetCategoriesOptions
  extends GetEntitiesOptions<
    Prisma.CategoryWhereInput,
    Prisma.CategoryOrderByWithRelationInput
  > {
  includeInactive?: boolean
  includeCount?: boolean
  includeProductCount?: boolean
}

/**
 * Retrieves categories from the database with caching and filtering options.
 * Optimized for both public category listings and admin management.
 */
export const getCategories = async ({
  includeInactive = false,
  includeCount = false,
  includeProductCount = false,
  limit,
  offset,
  orderBy = [{ priority: "asc" }, { updatedAt: "desc" }],
  where = {},
}: GetCategoriesOptions = {}): Promise<GetEntitiesResult<Category>> => {
  try {
    return await unstable_cache(
      async () => {
        const whereCondition = {
          // Only include active categories for public pages
          ...(!includeInactive && { isActive: true }),
          ...where,
        }

        // Use Promise.all for concurrent execution when count is needed
        if (includeCount) {
          const [data, total] = await Promise.all([
            prisma.category.findMany({
              where: whereCondition,
              ...(includeProductCount && {
                include: {
                  _count: {
                    select: {
                      products: {
                        where: { isActive: true },
                      },
                    },
                  },
                },
              }),
              orderBy,
              ...(limit && { take: limit }),
              ...(offset && { skip: offset }),
            }),
            prisma.category.count({
              where: whereCondition,
            }),
          ])

          return { data, total }
        }

        // Just get data when count is not needed
        const data = await prisma.category.findMany({
          where: whereCondition,
          ...(includeProductCount && {
            include: {
              _count: {
                select: {
                  products: {
                    where: { isActive: true },
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
        "categories",
        includeInactive ? "admin" : "public",
        `limit-${limit}`,
        `offset-${offset}`,
        `count-${includeCount}`,
        `product-count-${includeProductCount}`,
        JSON.stringify(orderBy),
        JSON.stringify(where),
      ],
      {
        tags: [REVALIDATE_TAGS.CATEGORIES],
        revalidate: includeInactive ? 300 : 3600,
      },
    )()
  } catch (error) {
    console.error("getCategories: Error fetching categories", {
      error: error instanceof Error ? error.message : error,
    })

    if (process.env.NODE_ENV === "production") {
      return { data: [] }
    }

    throw new Error("Failed to fetch categories")
  }
}

/**
 * Admin version that includes inactive categories
 */
export const getCategoriesAdmin = async (
  options: Omit<GetCategoriesOptions, "includeInactive" | "includeCount"> = {},
): Promise<Category[]> => {
  const result = await getCategories({ ...options, includeInactive: true })
  return result.data
}

/**
 * Admin version that includes inactive categories and total count
 */
export const getCategoriesAdminWithCount = async (
  options: Omit<GetCategoriesOptions, "includeInactive" | "includeCount"> = {},
): Promise<GetEntitiesResult<Category>> => {
  return getCategories({
    ...options,
    includeInactive: true,
    includeCount: true,
  })
}

/**
 * Public version that only includes active categories
 */
export const getCategoriesPublic = async (
  options: Omit<GetCategoriesOptions, "includeInactive" | "includeCount"> = {},
): Promise<Category[]> => {
  const result = await getCategories({
    ...options,
    includeInactive: false,
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }], // ✅ ترتيب حسب الأولوية
  })
  return result.data
}


/**
 * Public version that includes active categories and total count
 */
export const getCategoriesPublicWithCount = async (
  options: Omit<GetCategoriesOptions, "includeInactive" | "includeCount"> = {},
): Promise<GetEntitiesResult<Category>> => {
  return getCategories({
    ...options,
    includeInactive: false,
    includeCount: true,
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }], // ✅ نفس الترتيب
  })
}


export type CategoryWithProductCount = Category & {
  _count: { products: number }
}

/**
 * Get categories with product counts for navigation
 */
export const getCategoriesPublicWithProductCount = async (
  options: Omit<
    GetCategoriesOptions,
    "includeInactive" | "includeProductCount"
  > = {},
): Promise<CategoryWithProductCount[]> => {
  const result = await getCategories({
    ...options,
    includeInactive: false,
    includeProductCount: true,
  })
  return result.data as CategoryWithProductCount[]
}
