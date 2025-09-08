import Image from "next/image"
import Link from "next/link"

import { ShoppingBagIcon } from "lucide-react"

import type { CustomerOrderDetailsData } from "@/types/db"

import { SHARED_ORDER_UTILS } from "@/lib/shared/order-utils"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const OrderItemsCard = ({
  itemsPrice,
  orderItems,
}: Pick<CustomerOrderDetailsData, "itemsPrice" | "orderItems">) => {
  const formatPrice = SHARED_ORDER_UTILS.formatPrice

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBagIcon className="size-5" />
          Order Items
          <Badge variant="secondary" className="ml-auto">
            {orderItems.length} item
            {orderItems.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {orderItems.map((item, index) => (
            <div key={`${item.product.id}-${index}`}>
              <div className="flex gap-4">
                {/* Product Image */}
                <Link
                  href={`/products/${item.slug}`}
                  target="_blank"
                  className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg border"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover transition-all duration-200 hover:scale-105"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        target="_blank"
                        className="hover:text-primary text-sm leading-tight font-medium"
                      >
                        {item.name}
                      </Link>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm">•</span>
                        <span className="text-sm font-medium">
                          {formatPrice(item.price)} each
                        </span>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator between items */}
              {index < orderItems.length - 1 && (
                <Separator className="bg-border/50 mt-4" />
              )}
            </div>
          ))}
        </div>

        {/* Order Items Summary */}
        <Separator className="bg-border/50" />
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Items Subtotal</span>
          <span className="font-semibold">{formatPrice(itemsPrice)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
