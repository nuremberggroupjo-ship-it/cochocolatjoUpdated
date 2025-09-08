"use client"

import Image from "next/image"

import { cn, formatPrice } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import type { CheckoutCartSummary } from "@/features/checkout/types/checkout-types"

interface OrderSummaryProps {
  cartSummary: CheckoutCartSummary
  showItems?: boolean
  showPricing?: boolean
  className?: string
}

/**
 * Calculate effective price considering discounts
 */
const getEffectivePrice = (
  price: number,
  discountPrice: number | null,
  isDiscountActive: boolean,
) => {
  if (isDiscountActive && discountPrice) {
    return discountPrice
  }
  return price
}

/**
 * OrderSummary Component
 *
 * Displays order summary with items, quantities, and pricing
 * Used across checkout flow for consistency
 *
 * @param cartSummary - Cart data with items and totals
 * @param showItems - Whether to show individual items (default: true)
 * @param showPricing - Whether to show pricing breakdown (default: true)
 * @param className - Additional CSS classes
 */
export function OrderSummary({
  cartSummary,
  showItems = true,
  showPricing = true,
  className,
}: OrderSummaryProps) {
  const { items, itemsPrice, shippingPrice, totalItems, totalPrice } =
    cartSummary

  return (
    <Card className={cn("shadow-none", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items List */}
        {showItems && (
          <ul className="space-y-4">
            {items.map(({ id, product, quantity }) => {
              const effectivePrice = getEffectivePrice(
                product.price,
                product.discountPrice,
                product.isDiscountActive,
              )
              const finalPriceTotal = effectivePrice * quantity
              const oldPriceTotal = product.price * quantity

              return (
                <li key={id} className="flex gap-4">
                  {/* Product Image */}
                  <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={product.productImages[0].imageUrl}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="size-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 space-y-1">
                    <h4 className="line-clamp-1 text-sm leading-tight font-medium">
                      {product.name}
                    </h4>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          Qty:
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {quantity}
                        </Badge>
                      </div>

                      <div className="text-right">
                        {product.isDiscountActive && product.discountPrice ? (
                          <div className="space-y-1">
                            <div className="text-muted-foreground text-xs line-through">
                              {formatPrice(oldPriceTotal)}
                            </div>
                            <div className="text-sm font-medium">
                              {formatPrice(finalPriceTotal)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm font-medium">
                            {formatPrice(finalPriceTotal)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {showItems && showPricing && <Separator className="bg-border/50" />}

        {/* Pricing Summary */}
        {showPricing && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({totalItems} items)</span>
              <span>{formatPrice(itemsPrice)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {shippingPrice === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  formatPrice(shippingPrice)
                )}
              </span>
            </div>

            <Separator className="bg-border/50" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
