import Link from "next/link"
import { FC } from "react"

import { formatDistanceToNow } from "date-fns"
import { CheckCircle, HomeIcon } from "lucide-react"

import type { CustomerOrderDetailsData } from "@/types/db"

import { formatDate } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { CopyButton } from "@/components/shared/copy-button"

import {
  DeliveryDetailsCard,
  NeedHelpCard,
  OrderItemsCard,
  OrderStatusTracker,
  PaymentDetailsCard,
} from "@/features/order-details/components/order-details-content/components"

interface OrderSuccessContentProps {
  order: CustomerOrderDetailsData
}

export const OrderSuccessContent: FC<OrderSuccessContentProps> = ({
  order,
}) => {
  return (
    <div className="my-4 space-y-6">
      {/* Success Header */}
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="size-8 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-green-600">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Thank you for your order. Your chocolates are being prepared.
          </p>
        </div>
      </div>

      {/* Order Header - Similar to Order Details */}
      <div className="space-y-2">
        {/* Order Number */}
        <div className="inline-flex items-center gap-2">
          <h2 className="text-xl font-bold md:text-2xl">{order.orderNumber}</h2>
          <CopyButton text={order.orderNumber} label="Order Number" />
        </div>

        {/* Order Date + Status*/}
        <div className="flex items-baseline gap-2 text-sm">
          <div className="flex flex-col">
            <span>{formatDate(order.createdAt as Date)}</span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(order.createdAt, {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Cards - Same as Order Details */}
      <div className="columns-1 gap-4 space-y-4 lg:columns-2">
        {/* Order Status Tracker */}
        <div className="break-inside-avoid">
          <OrderStatusTracker
            currentStatus={order.status}
            deliveryType={order.deliveryType}
            isPaid={order.isPaid}
            isDelivered={order.isDelivered}
            paidAt={order.paidAt}
            deliveredAt={order.deliveredAt}
          />
        </div>

        {/* Order Items */}
        <div className="break-inside-avoid">
          <OrderItemsCard
            itemsPrice={order.itemsPrice}
            orderItems={order.orderItems}
          />
        </div>

        {/* Delivery Details */}
        <div className="break-inside-avoid">
          <DeliveryDetailsCard
            deliveryType={order.deliveryType}
            shippingAddress={order.shippingAddress}
            isPaid={order.isPaid}
            paymentMethod={order.paymentMethod}
          />
        </div>

        {/* Payment Details */}
        <div className="break-inside-avoid">
          <PaymentDetailsCard
            deliveryType={order.deliveryType}
            isPaid={order.isPaid}
            paidAt={order.paidAt}
            paymentMethod={order.paymentMethod}
          />
        </div>

        {/* Need Help Card */}
        <div className="break-inside-avoid">
          <NeedHelpCard
            orderNumber={order.orderNumber}
            createdAt={order.createdAt}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start gap-4">
        <Button asChild variant="outline">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild>
          <Link href="/">
            <HomeIcon className="size-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
