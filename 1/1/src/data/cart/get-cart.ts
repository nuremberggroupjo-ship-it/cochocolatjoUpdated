import { unstable_cache } from "next/cache"

import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

/**
 * Get cart count for the current user/session
 */
export const getCartCount = async () => {
  try {
    const { userId, sessionCartId } = await getCurrentSessionInfo()
    if (!sessionCartId) return 0

    const userCacheKey = userId ? `user-${userId}` : `session-${sessionCartId}`

    return await unstable_cache(
      async () => {
        const cart = await prisma.cart.findFirst({
          where: userId ? { userId } : { sessionCartId },
          select: {
            cartItems: {
              select: { quantity: true },
            },
          },
        })

        return (
          cart?.cartItems.reduce((total, item) => total + item.quantity, 0) || 0
        )
      },
      [`cart-count-${userCacheKey}`],
      {
        tags: [
          REVALIDATE_TAGS.CART,
          `cart-${userCacheKey}`,
          `products-${userCacheKey}`,
        ],
        revalidate: 60, // Cache for 60 seconds
      },
    )()
  } catch (error) {
    console.error("Error getting cart count:", error)
    return 0
  }
}

/**
 * Get paginated cart items with product details
 */
export const getCartItemsPaginated = async (
  page: number = 1,
  limit: number = 5,
) => {
  try {
    const { userId, sessionCartId } = await getCurrentSessionInfo()
    if (!sessionCartId) return { items: [], total: 0, cart: null }

    const userCacheKey = userId ? `user-${userId}` : `session-${sessionCartId}`

    return await unstable_cache(
      async () => {
        const cart = await prisma.cart.findFirst({
          where: userId ? { userId } : { sessionCartId },
          include: {
            cartItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    discountPrice: true,
                    isDiscountActive: true,
                    stock: true,
                    shortDescription: true,
                    productImages: {
                      take: 1,
                      select: { imageUrl: true },
                    },
                  },
                },
              },
              orderBy: { productId: "asc" },
              skip: (page - 1) * limit,
              take: limit,
            },
          },
        })

        if (!cart) return { items: [], total: 0, cart: null }

        // Get total count for pagination
        const totalCount = await prisma.cartItem.count({
          where: { cartId: cart.id },
        })

        return {
          items: cart.cartItems,
          total: Math.ceil(totalCount / limit),
          cart: {
            id: cart.id,
            itemsPrice: cart.itemsPrice,
            totalPrice: cart.totalPrice,
            shippingPrice: cart.shippingPrice,
          },
        }
      },
      [`cart-items-${userCacheKey}-page-${page}-limit-${limit}`],
      {
        tags: [
          REVALIDATE_TAGS.CART,
          `cart-${userCacheKey}`,
          `products-${userCacheKey}`,
        ],
        revalidate: 60, // Cache for 60 seconds
      },
    )()
  } catch (error) {
    console.error("Error getting cart items:", error)
    return { items: [], total: 0, cart: null }
  }
}

/**
 * Get cart summary data (for layout)
 */
export const getCartSummary = async () => {
  try {
    const { userId, sessionCartId } = await getCurrentSessionInfo()
    if (!sessionCartId) return null

    const userCacheKey = userId ? `user-${userId}` : `session-${sessionCartId}`

    return await unstable_cache(
      async () => {
        const cart = await prisma.cart.findFirst({
          where: userId ? { userId } : { sessionCartId },
          select: {
            id: true,
            itemsPrice: true,
            totalPrice: true,
            shippingPrice: true,
            cartItems: {
              select: { quantity: true },
            },
          },
        })

        if (!cart) return null

        const totalItemCount = cart.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        )

        return {
          id: cart.id,
          itemsPrice: cart.itemsPrice,
          totalPrice: cart.totalPrice,
          shippingPrice: cart.shippingPrice,
          totalItemCount,
        }
      },
      [`cart-summary-${userCacheKey}`],
      {
        tags: [
          REVALIDATE_TAGS.CART,
          `cart-${userCacheKey}`,
          `products-${userCacheKey}`,
        ],
        revalidate: 60, // Cache for
      },
    )()
  } catch (error) {
    console.error("Error getting cart summary:", error)
    return null
  }
}
