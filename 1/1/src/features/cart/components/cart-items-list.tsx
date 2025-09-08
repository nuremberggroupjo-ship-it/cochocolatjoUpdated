import { redirect } from "next/navigation"
import { FC } from "react"

import { EmptyState } from "@/components/shared/empty-state"
import { PaginationBar } from "@/components/shared/pagination-bar"

import type { CartItemType } from "@/features/cart/types"

import { CartItem } from "./cart-item"

interface CartItemsListProps {
  data: {
    items: Array<CartItemType>
    total: number
    cart: {
      id: string
      itemsPrice: number | string
      totalPrice: number | string
      shippingPrice: number | string
    } | null
  }
  currentPage: number
}

export const CartItemsList: FC<CartItemsListProps> = ({
  data,
  currentPage,
}) => {
  const { items, total, cart } = data

  if (!cart || total === 0) {
    return (
      <div className="py-16">
        <EmptyState
          title="Your cart is empty"
          description="Add some delicious chocolates to get started!"
          linkText="Continue Shopping"
          linkHref="/shop-now"
        />
      </div>
    )
  }

  if (total > 0 && items.length === 0) {
    // Redirect to the last page if currentPage is out of range

    redirect(`/cart?page=${total}`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div className="flex justify-center">
          <PaginationBar currentPage={currentPage} totalPages={total} />
        </div>
      )}
    </div>
  )
}
