import Image from "next/image"
import Link from "next/link"

import { ExternalLinkIcon, PackageIcon } from "lucide-react"

import type { OrderAdminData } from "@/types/db"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip"

import { ADMIN_TABLE } from "@/features/admin/constants"
import { ORDER_UTILS } from "@/features/admin/features/orders/constants"

export const OrderItemsCard = (
  props: Pick<
    OrderAdminData,
    "orderItems" | "itemsPrice" | "shippingPrice" | "totalPrice"
  >,
) => {
  const { orderItems, itemsPrice, shippingPrice, totalPrice } = props

 
  
  

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackageIcon className="size-5" />
          Order Items ({orderItems.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orderItems.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="flex items-center gap-4"
            >
              {/* Product Image */}
              <div className="bg-muted size-16 shrink-0 overflow-hidden rounded-lg">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="size-full object-cover"
                  />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-1">
                {/* Name */}
                <div className="flex items-center gap-1">
                  <h4 className="line-clamp-1 leading-tight font-medium">
                    {item.name}
                  </h4>
                  <ButtonWithTooltip
                    className="size-6"
                    tooltipContent={`View "${item.name}" details`}
                  >
                    <Link
                      href={`${ADMIN_TABLE.products.routes.default}/${item.slug}`}
                    >
                      <span className="sr-only">View {item.name} details</span>
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Link>
                  </ButtonWithTooltip>
                </div>
                {/* Qty + each price */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Qty: {item.quantity}
                  </span>
                  <span className="font-medium">
                    {ORDER_UTILS.formatPrice(Number(item.price))} each
                  </span>
                </div>
                {/* total price of product */}
                <div className="text-right">
                  <span className="font-semibold">
                    {ORDER_UTILS.formatPrice(
                      Number(item.price) * item.quantity,
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <Separator className="bg-border/50" />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{ORDER_UTILS.formatPrice(Number(itemsPrice))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {Number(shippingPrice) === 0 ? (
                  <span className="text-success">Shipping fees will be added</span>
                ) : (
                  ORDER_UTILS.formatPrice(Number(shippingPrice))
                )}
              </span>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{ORDER_UTILS.formatPrice(Number(totalPrice))}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
