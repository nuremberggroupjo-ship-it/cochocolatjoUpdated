// src/data/banners/get-banners.ts
import { unstable_cache } from "next/cache"

import { GetEntitiesOptions, GetEntitiesResult } from "@/types"

import { Banner, Prisma } from "@/lib/_generated/prisma"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

interface GetBannersOptions
  extends GetEntitiesOptions<
    Prisma.BannerWhereInput,
    Prisma.BannerOrderByWithRelationInput
  > {
  includeInactive?: boolean
  includeCount?: boolean
}

/**
 * Retrieves banners from the database with caching and filtering options.
 * Optimized for both public banner display and admin management.
 */
export const getBanners = async ({
  includeInactive = false,
  includeCount = false,
  limit,
  offset,
  orderBy = [{ priority: "asc" }, { updatedAt: "desc" }], // Priority first (0 = highest)
  where = {},
}: GetBannersOptions = {}): Promise<GetEntitiesResult<Banner>> => {
  try {
    return await unstable_cache(
      async () => {
        const whereCondition = {
          // Only include active banners for public pages
          ...(!includeInactive && { isActive: true }),
          ...where,
        }

        // Use Promise.all for concurrent execution when count is needed
        if (includeCount) {
          const [data, total] = await Promise.all([
            prisma.banner.findMany({
              where: whereCondition,
              orderBy,
              ...(limit && { take: limit }),
              ...(offset && { skip: offset }),
            }),
            prisma.banner.count({
              where: whereCondition,
            }),
          ])

          return { data, total }
        }

        // Just get data when count is not needed
        const data = await prisma.banner.findMany({
          where: whereCondition,
          orderBy,
          ...(limit && { take: limit }),
          ...(offset && { skip: offset }),
        })

        return { data }
      },
      [
        "banners",
        includeInactive ? "admin" : "public",
        `limit-${limit}`,
        `offset-${offset}`,
        `count-${includeCount}`,
        JSON.stringify(orderBy),
        JSON.stringify(where),
      ],
      {
        tags: [REVALIDATE_TAGS.BANNERS],
        revalidate: includeInactive ? 300 : 3600,
      },
    )()
  } catch (error) {
    console.error("getBanners: Error fetching banners", {
      error: error instanceof Error ? error.message : error,
    })

    if (process.env.NODE_ENV === "production") {
      return { data: [] }
    }

    throw new Error("Failed to fetch banners")
  }
}

/**
 * Admin version that includes inactive banners
 */
export const getBannersAdmin = async (
  options: Omit<GetBannersOptions, "includeInactive" | "includeCount"> = {},
): Promise<Banner[]> => {
  const result = await getBanners({ ...options, includeInactive: true })
  return result.data
}

/**
 * Admin version that includes inactive banners and total count
 * Useful for admin interfaces where both active and inactive banners are needed
 */
export const getBannersAdminWithCount = async (
  options: Omit<GetBannersOptions, "includeInactive" | "includeCount"> = {},
): Promise<GetEntitiesResult<Banner>> => {
  return getBanners({ ...options, includeInactive: true, includeCount: true })
}

/**
 * Public version that only includes active banners
 * Useful for public-facing pages where only active banners should be displayed
 */
export const getBannersPublic = async (
  options: Omit<GetBannersOptions, "includeInactive" | "includeCount"> = {},
): Promise<Banner[]> => {
  const result = await getBanners({ ...options, includeInactive: false })
  return result.data
}

/**
 * Public version that includes active banners and total count
 * Useful for public-facing pages where banner count is needed
 */
export const getBannersPublicWithCount = async (
  options: Omit<GetBannersOptions, "includeInactive" | "includeCount"> = {},
): Promise<GetEntitiesResult<Banner>> => {
  return getBanners({ ...options, includeInactive: false, includeCount: true })
}
