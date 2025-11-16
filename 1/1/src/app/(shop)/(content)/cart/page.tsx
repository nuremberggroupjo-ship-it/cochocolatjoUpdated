import type { Metadata } from "next"
import { Suspense } from "react"

import { WithRequiredSearchParams } from "@/types"

import { getCartItemsPaginated } from "@/data"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { CartItemsListSkeleton } from "@/components/shared/skeletons/cart-skeletons"

import { CartItemsList } from "@/features/cart/components/cart-items-list"

export const metadata: Metadata = createMetadata(PAGE_METADATA.cart)

type CartPageProps = WithRequiredSearchParams

async function CartPageData({ currentPage }: { currentPage: number }) {
  const data = await getCartItemsPaginated(currentPage, 3)

  // Convert Decimal types to numbers for the component
  const convertedData = {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        discountPrice: item.product.discountPrice
          ? Number(item.product.discountPrice)
          : null,
      },
    })),
    cart: data.cart
      ? {
          ...data.cart,
          itemsPrice: Number(data.cart.itemsPrice),
          totalPrice: Number(data.cart.totalPrice),
          shippingPrice: Number(data.cart.shippingPrice) ,
        }
      : null,
  }

  return <CartItemsList data={convertedData} currentPage={currentPage} />
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams.page) || 1

  return (
    <Suspense fallback={<CartItemsListSkeleton />} key={currentPage}>
      <CartPageData currentPage={currentPage} />
    </Suspense>
  )
}
