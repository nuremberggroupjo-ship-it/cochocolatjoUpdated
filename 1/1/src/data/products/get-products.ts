import { unstable_cache } from "next/cache";

import type {
  GetEntitiesOptions,
  GetEntitiesResult,
  ProductsSort,
} from "@/types";
import { ProductData, getProductDataSelect } from "@/types/db";

import { Prisma } from "@/lib/_generated/prisma";
import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info";
import prisma from "@/lib/prisma";
import { convertToPlainObject } from "@/lib/utils";

import {
  FEATURED_PRODUCTS_PER_PAGE,
  PRODUCTS_PER_PAGE,
  REVALIDATE_TAGS,
} from "@/constants";

interface GetProductsOptions
  extends GetEntitiesOptions<
    Prisma.ProductWhereInput,
    Prisma.ProductOrderByWithRelationInput
  > {
  includeInactive?: boolean;
  includeCount?: boolean;
  includeFavorites?: boolean;
  includeCart?: boolean;
  page?: number;
}

/**
 * Retrieves products from the database with caching and filtering options.
 * Optimized for both public product listings and admin management.
 */
export const getProducts = async ({
  includeInactive = false,
  includeCount = false,
  limit,
  offset,
  orderBy = [{ updatedAt: "desc" }],
  where = {},
  includeFavorites = false,
  includeCart = false,
}: GetProductsOptions = {}): Promise<GetEntitiesResult<ProductData>> => {
  try {
    // Get user session info if including favorites or cart
    let userId: string | undefined;
    let sessionFavoriteId: string | undefined;
    let sessionCartId: string | undefined;

    if (includeFavorites || includeCart) {
      const sessionInfo = await getCurrentSessionInfo();
      userId = sessionInfo.userId;

      // Only get session IDs if we're including them specifically
      if (includeFavorites) {
        sessionFavoriteId = sessionInfo.sessionFavoriteId;
      }
      if (includeCart) {
        sessionCartId = sessionInfo.sessionCartId;
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
        : "no-user";

    return await unstable_cache(
      async () => {
        const whereCondition = {
          ...(!includeInactive && { isActive: true }),
          ...(!includeInactive && {
            category: {
              isActive: true,
            },
          }),
          ...where,
        };

        if (includeCount) {
          const [data, total] = await Promise.all([
            prisma.product.findMany({
              where: whereCondition,
              select: getProductDataSelect(
                userId,
                sessionFavoriteId,
                sessionCartId
              ),
              orderBy,
              ...(limit && { take: limit }),
              ...(offset && { skip: offset }),
            }),
            prisma.product.count({
              where: whereCondition,
            }),
          ]);

          return { data, total };
        }

        const data = await prisma.product.findMany({
          where: whereCondition,
          select: getProductDataSelect(
            userId,
            sessionFavoriteId,
            sessionCartId
          ),
          orderBy,
          ...(limit && { take: limit }),
          ...(offset && { skip: offset }),
        });

        return { data };
      },
      [
        "products",
        includeInactive ? "admin" : "public",
        `limit-${limit}`,
        `offset-${offset}`,
        `count-${includeCount}`,
        `favorites-${includeFavorites}`,
        `cart-${includeCart}`,
        userCacheKey, // Add user context to cache key
        JSON.stringify(orderBy),
        JSON.stringify(where),
      ],
      {
        tags: [
          REVALIDATE_TAGS.PRODUCTS,
          ...(includeFavorites || includeCart
            ? [`products-${userCacheKey}`]
            : []), // Add user-specific tag
        ],
        revalidate: includeInactive ? 300 : 3600,
      }
    )();
  } catch (error) {
    console.error("getProducts: Error fetching products", {
      error: error instanceof Error ? error.message : error,
    });

    if (process.env.NODE_ENV === "production") {
      return { data: [] };
    }

    throw new Error("Failed to fetch products");
  }
};

/**
 * Admin version that includes inactive products
 */
export const getProductsAdmin = async (
  options: Omit<
    GetProductsOptions,
    "includeInactive" | "includeCount" | "includeFavorites"
  > = {}
): Promise<ProductData[]> => {
  const result = await getProducts({ ...options, includeInactive: true });
  return result.data;
};

/**
 * Admin version that includes inactive products and total count
 */
export const getProductsAdminWithCount = async (
  options: Omit<GetProductsOptions, "includeInactive" | "includeCount"> = {}
): Promise<GetEntitiesResult<ProductData>> => {
  return getProducts({ ...options, includeInactive: true, includeCount: true });
};

/**
 * Public version that only includes active products
 */
export const getProductsPublic = async (
  options: Omit<
    GetProductsOptions,
    "includeInactive" | "includeCount" | "includeFavorites"
  > = {}
): Promise<ProductData[]> => {
  const result = await getProducts({
    ...options,
    includeInactive: false,
    includeFavorites: false,
  });
  return result.data;
};

/**
 * Public version that includes active products and total count
 */
export const getProductsPublicWithCount = async (
  options: Omit<GetProductsOptions, "includeInactive" | "includeCount"> = {}
): Promise<GetEntitiesResult<ProductData>> => {
  return getProducts({
    ...options,
    includeInactive: false,
    includeCount: true,
  });
};

/**
 * Get featured products for homepage
 */
export const getFeaturedProducts = async (
  limit = FEATURED_PRODUCTS_PER_PAGE
): Promise<ProductData[]> => {
  const result = await getProducts({
    includeInactive: false,
    where: { isFeatured: true },
    limit,
    orderBy: [{ updatedAt: "desc" }],
    includeFavorites: true,
    includeCart: true,
  });
  return convertToPlainObject(result.data);
};

export const getProductsPublicByCategoryPaginated = async (
  categorySlug: string,
  options: Omit<
    GetProductsOptions,
    "includeInactive" | "includeCount" | "includeFavorites" | "includeCart"
  > = {}
): Promise<GetEntitiesResult<ProductData>> => {
  const { page = 1, limit = PRODUCTS_PER_PAGE } = options;
  const offset = (page - 1) * limit;

  const result = await getProducts({
    ...options,
    includeInactive: false,
    includeCount: true,
    includeFavorites: true,
    includeCart: true,
    offset,
    limit,
    where: {
      category: { slug: categorySlug },
      ...options.where,
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil((result.total || 0) / limit);

  return {
    ...result,
    total: totalPages,
  };
};

export const getFavoriteProductsPaginated = async (
  options: Omit<
    GetProductsOptions,
    "includeInactive" | "includeCount" | "includeFavorites" | "includeCart"
  > = {}
): Promise<GetEntitiesResult<ProductData>> => {
  const { page = 1, limit = PRODUCTS_PER_PAGE } = options;
  const offset = (page - 1) * limit;

  // Get user session info
  const sessionInfo = await getCurrentSessionInfo();
  const { userId, sessionFavoriteId } = sessionInfo;

  // Return empty if no session
  if (!userId && !sessionFavoriteId) {
    return { data: [], total: 0 };
  }

  // Use the main getProducts function with favorites filter
  const result = await getProducts({
    includeInactive: false,
    includeCount: true,
    includeFavorites: true,
    includeCart: true,
    offset,
    limit,
    where: {
      favorites: {
        some: userId ? { userId } : { sessionFavoriteId },
      },
    },
  });

  const totalPages = Math.ceil((result.total || 0) / limit);

  return {
    ...result,
    total: totalPages,
  };
};

export const getProductsPublicFilteredPaginated = async (
  q?: string,
  categories?: string[],
  attributes?: string[],
  sort?: ProductsSort,
  sale?: string[],
  unit?:string[],// ✅ new
  
  options: Omit<
    GetProductsOptions,
    "includeInactive" | "includeCount" | "includeFavorites" | "includeCart"
  > = {}
) => {
  const { page = 1, limit = PRODUCTS_PER_PAGE } = options;
  const offset = (page - 1) * limit;

  const where = { ...(options.where || {}) };

  if (categories && categories.length > 0) {
    where.category = {
      slug: { in: categories },
      isActive: true,
    };
  }

  if (attributes && attributes.length > 0) {
    where.attributes = {
      some: {
        attribute: { slug: { in: attributes } },
      },
    };
  }
  if (sale && sale.length > 0) {
    where.isDiscountActive = true;
  }

  if (unit?.length) {
  where.unit = { in: unit };
}




  if (q && q.trim() !== "") {
    where.name = { contains: q, mode: "insensitive" };
  }

  let orderBy = [...(options.orderBy || [])];

  switch (sort) {
    case "price-asc":
      orderBy = [{ price: "asc" }];
      break;
    case "price-desc":
      orderBy = [{ price: "desc" }];
      break;
    case "alpha-asc":
      orderBy = [{ name: "asc" }];
      break;
    case "alpha-desc":
      orderBy = [{ name: "desc" }];
      break;
    default:
      orderBy = [{ priority: "asc" }];
      break;
  }

  const result = await getProducts({
    includeInactive: false,
    includeCount: true,
    includeFavorites: true,
    includeCart: true,
    offset,
    limit,
    where,
    orderBy,
  });

  const totalPages = Math.ceil((result.total || 0) / limit);

  return {
    ...result,
    total: totalPages,
  };
};
