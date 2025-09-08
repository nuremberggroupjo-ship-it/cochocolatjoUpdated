import { FC } from "react"
import { formatDistanceToNow } from "date-fns"

import type { CustomerOrderDetailsData } from "@/types/db"
import { formatDate } from "@/lib/utils"
import { CopyButton } from "@/components/shared/copy-button"

import {
  DeliveryDetailsCard,
  NeedHelpCard,
  OrderItemsCard,
  OrderStatusTracker,
  PaymentDetailsCard,
} from "./components"

interface OrderDetailsContentProps {
  order: CustomerOrderDetailsData
}

export const OrderDetailsContent: FC<OrderDetailsContentProps> = ({ order }) => {
  return (
    <div className="my-4 space-y-4">
      {/* Page Header */}
      <div className="space-y-2">
        {/* Order Number */}
        <div className="inline-flex items-center gap-2">
          <h1 className="text-xl font-bold md:text-2xl">{order.orderNumber}</h1>
          <CopyButton text={order.orderNumber} label="Order Number" />
        </div>

        {/* Order Date + Status*/}
        <div className="flex items-baseline gap-2 text-sm">
          <div className="flex flex-col">
            <span>{formatDate(order.createdAt as Date)}</span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(order.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      {/*  Cards */}
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

        {/* Extras (Gift + Delivery Date) */}
        <div className="break-inside-avoid rounded-md border p-4">
          <h3 className="text-base font-semibold mb-2 text-red-500">Extras</h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className={
                  order.is_gift
                    ? "text-green-600 font-medium"
                    : "text-muted-foreground"
                }
              >
                {order.is_gift ? "🎁 Marked as Gift" : "Not a Gift"}
              </span>
            </div>

            {order.date ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Delivery Date:</span>
                <span className="text-sm font-medium">
                  {new Date(order.date).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No scheduled delivery date
              </div>
            )}
          </div>
        </div>

        {/* Order Actions */}
        <div className="break-inside-avoid">
          <NeedHelpCard
            orderNumber={order.orderNumber}
            createdAt={order.createdAt}
          />
        </div>
      </div>
    </div>
  )
}
