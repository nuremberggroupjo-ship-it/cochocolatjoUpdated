/**
 * Checkout data fetching functions
 * Handles cart data retrieval and transformation for checkout flow
 */
import { unstable_cache } from "next/cache"

import getCurrentSessionInfo from "@/lib/helpers/get-current-session-info"
import prisma from "@/lib/prisma"

import { REVALIDATE_TAGS } from "@/constants"

import type {
  CheckoutCartItem,
  CheckoutCartSummary,
} from "@/features/checkout/types/checkout-types"

/**
 * Get cart data formatted for checkout
 * @returns Cart summary with items and pricing for checkout process
 */
export const getCheckoutCartData =
  async (): Promise<CheckoutCartSummary | null> => {
    try {
      const { userId, sessionCartId } = await getCurrentSessionInfo()

      if (!sessionCartId) {
        return null
      }

      const userCacheKey = userId
        ? `user-${userId}`
        : `session-${sessionCartId}`

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
              },
            },
          })

          if (!cart || cart.cartItems.length === 0) {
            return null
          }

          // Transform cart items to checkout format
          const checkoutItems: CheckoutCartItem[] = cart.cartItems.map(
            (item) => ({
              id: item.productId,
              quantity: item.quantity,
              product: {
                id: item.product.id,
                name: item.product.name,
                slug: item.product.slug,
                price: Number(item.product.price),
                discountPrice: item.product.discountPrice
                  ? Number(item.product.discountPrice)
                  : null,
                isDiscountActive: item.product.isDiscountActive,
                stock: item.product.stock,
                shortDescription: item.product.shortDescription,
                productImages: item.product.productImages,
              },
            }),
          )

          // Calculate totals
          const totalItems = checkoutItems.reduce(
            (sum, item) => sum + item.quantity,
            0,
          )
          const itemsPrice = Number(cart.itemsPrice)
          const shippingPrice = Number(cart.shippingPrice)
          const totalPrice = Number(cart.totalPrice)

          return {
            id: cart.id,
            itemsPrice,
            shippingPrice,
            totalPrice,
            items: checkoutItems,
            totalItems,
          }
        },
        [`checkout-cart-${userCacheKey}`],
        {
          tags: [
            REVALIDATE_TAGS.CART,
            `cart-${userCacheKey}`,
            `products-${userCacheKey}`,
          ],
          revalidate: 30, // Cache for 30 seconds during checkout
        },
      )()
    } catch (error) {
      console.error("Error getting checkout cart data:", error)
      return null
    }
  }

/**
 * Calculate shipping cost based on order total
 * @param itemsPrice - Total price of items in cart
 * @returns Shipping cost (0 if free shipping applies, 3 otherwise)
 */
export const calculateShippingCost = (itemsPrice: number): number => {
  const FREE_SHIPPING_THRESHOLD = 30 // 30 JOD
  const SHIPPING_COST = 3 // 3 JOD

  return itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
}

/**
 * Calculate final checkout totals
 * @param cartSummary - Cart summary data
 * @param deliveryType - Selected delivery type
 * @returns Final pricing breakdown
 */
export const calculateCheckoutTotals = (
  cartSummary: CheckoutCartSummary,
  deliveryType: "PICKUP" | "DELIVERY",
) => {
  const itemsPrice = cartSummary.itemsPrice
  const shippingPrice =
    deliveryType === "PICKUP" ? 0 : calculateShippingCost(itemsPrice)
  const totalPrice = itemsPrice + shippingPrice

  return {
    itemsPrice,
    shippingPrice,
    totalPrice,
  }
}

/**
 * Validate cart items for checkout
 * @param cartSummary - Cart summary to validate
 * @returns Validation result with any errors
 */
export const validateCartForCheckout = (
  cartSummary: CheckoutCartSummary | null,
) => {
  if (!cartSummary) {
    return {
      isValid: false,
      error: "Cart is empty",
    }
  }

  if (cartSummary.items.length === 0) {
    return {
      isValid: false,
      error: "Cart has no items",
    }
  }

  // Check stock availability
  const outOfStockItems = cartSummary.items.filter(
    (item) => item.product.stock < item.quantity,
  )

  if (outOfStockItems.length > 0) {
    return {
      isValid: false,
      error: `Some items are out of stock: ${outOfStockItems.map((item) => item.product.name).join(", ")}`,
    }
  }

  return {
    isValid: true,
    error: null,
  }
}
