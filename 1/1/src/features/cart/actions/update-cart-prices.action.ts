"use server"

import { Prisma } from "@/lib/_generated/prisma"
import prisma from "@/lib/prisma"

/**
 * Update cart prices based on current cart items
 */
export async function updateCartPrices(
  cartId: string,
  tx: Prisma.TransactionClient = prisma,
) {
  // Get all cart items with product data
  const cartItems = await tx.cartItem.findMany({
    where: { cartId },
    include: {
      product: {
        select: {
          price: true,
          discountPrice: true,
          isDiscountActive: true,
        },
      },
    },
  })

  // Calculate total items price
  let itemsPrice = 0
  for (const item of cartItems) {
    const product = item.product
    const itemPrice =
      product.isDiscountActive && product.discountPrice
        ? Number(product.discountPrice)
        : Number(product.price)
    itemsPrice += itemPrice * item.quantity
  }

  // For now, shipping is 0 and total equals items price
  const shippingPrice = 0
  const totalPrice = itemsPrice + shippingPrice

  // Update cart with calculated prices
  await tx.cart.update({
    where: { id: cartId },
    data: {
      itemsPrice,
      totalPrice,
      shippingPrice,
    },
  })

  return { itemsPrice, totalPrice, shippingPrice }
}
