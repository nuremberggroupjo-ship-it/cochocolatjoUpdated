import { revalidateTag } from "next/cache"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Helper function to revalidate all product-related cache tags
 * This is used for both cart and favorites operations to ensure UI consistency
 */
export function revalidateProductCache(
  userId?: string,
  sessionCartId?: string,
  sessionFavoriteId?: string,
) {
  // Always revalidate general products cache
  revalidateTag(REVALIDATE_TAGS.PRODUCTS)

  if (userId && sessionCartId) {
    // Post-login: invalidate both old session and new user caches
    revalidateTag(`products-user-${userId}`)
    revalidateTag(`products-session-${sessionCartId}`)

    if (sessionFavoriteId) {
      revalidateTag(`products-session-${sessionFavoriteId}`)
    }
  } else if (userId) {
    // For logged-in users, revalidate all their product caches
    revalidateTag(`products-user-${userId}`)
  } else {
    // For guest users, invalidate session-based caches
    if (sessionCartId) {
      revalidateTag(`products-session-${sessionCartId}`)
    }
    if (sessionFavoriteId) {
      revalidateTag(`products-session-${sessionFavoriteId}`)
    }
    // Combined cache key is only needed when both favorites and cart are included in the same request
    if (
      sessionFavoriteId &&
      sessionCartId &&
      sessionFavoriteId !== sessionCartId
    ) {
      revalidateTag(`products-session-${sessionFavoriteId}-${sessionCartId}`)
    }
  }
}

/**
 * Helper function to revalidate all cart-related cache tags
 * This is used for both cart and favorites operations to ensure UI consistency
 */
export function revalidateCartCache(userId?: string, sessionCartId?: string) {
  // Always revalidate general cart cache
  revalidateTag(REVALIDATE_TAGS.CART)

  if (userId && sessionCartId) {
    // New user cache format
    revalidateTag(`cart-user-${userId}`)
    revalidateTag(`products-user-${userId}`)

    // Old session cache format
    revalidateTag(`cart-session-${sessionCartId}`)
    revalidateTag(`products-session-${sessionCartId}`)
  } else if (userId) {
    // Regular user operations
    revalidateTag(`cart-user-${userId}`)
    revalidateTag(`products-user-${userId}`)
  } else if (sessionCartId) {
    // Regular guest operations
    revalidateTag(`cart-session-${sessionCartId}`)
    revalidateTag(`products-session-${sessionCartId}`)
  }
}
