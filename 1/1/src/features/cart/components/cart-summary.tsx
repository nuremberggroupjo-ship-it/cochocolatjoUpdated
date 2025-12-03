import Link from "next/link"
import { FC } from "react"

import { getCartSummary } from "@/data"

import { formatPrice } from "@/lib/utils"

import { Button } from "@/components/ui/button"

export const CartSummary: FC = async () => {
  const cartSummary = await getCartSummary()

  if (!cartSummary) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">Your cart is empty</p>
      </div>
    )
  }

  const totalPrice = Number(cartSummary.totalPrice)
  const shippingPrice = Number(cartSummary.shippingPrice)
  const itemCount = cartSummary.totalItemCount

  const disabled = totalPrice <= 0 && itemCount === 0

  return (
    <div className="h-fit space-y-4 rounded-lg border p-6">
      <h2 className="text-base font-semibold md:text-lg lg:text-xl">
        Cart Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span> {formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span>
            {shippingPrice === 0 ? "Delivery fees will be added" : formatPrice(shippingPrice)}
          </span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-base font-semibold lg:text-lg">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Link href="/checkout">
          <Button
            size="lg"
            disabled={disabled}
            className="w-full cursor-pointer"
          >
            Proceed to Checkout
          </Button>
        </Link>
        <Link href="/shop-now">
          <Button size="lg" variant="outline" className="w-full cursor-pointer">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}
