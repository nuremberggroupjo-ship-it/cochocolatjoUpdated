import type { OrderAdminData } from "@/types/db"

import {
  AdditionalNotesCard,
  CustomerInfoCard,
  OrderHeaderCard,
  OrderItemsCard,
  PaymentDeliveryStatusCard,
  ShippingAddressCard,
} from "./components"

interface OrderInfoDisplayProps {
  order: OrderAdminData
}

export function OrderInfoDisplay({ order }: OrderInfoDisplayProps) {
  const {
    orderNumber,
    status,
    deliveryType,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    itemsPrice,
    shippingPrice,
    totalPrice,
    additionalNotes,
    guestName,
    guestPhone,
    guestEmail,
    shippingAddress,
    user,
    orderItems,
    createdAt,
    updatedAt,
    is_gift,
    date
  } = order

  console.log("order: ",order);
  

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Order Header */}
      <OrderHeaderCard
        orderNumber={orderNumber}
        createdAt={createdAt}
        updatedAt={updatedAt}
        status={status}
        deliveryType={deliveryType}
        totalPrice={totalPrice}
      />
      {/* Customer Information */}
      <CustomerInfoCard
        user={user}
        guestName={guestName}
        guestEmail={guestEmail}
        guestPhone={guestPhone}
      />
      {/* Shipping Address (for delivery orders) */}
      {deliveryType === "DELIVERY" && shippingAddress && (
        <ShippingAddressCard shippingAddress={shippingAddress} />
      )}

      {/* Order Items */}
      <OrderItemsCard
        orderItems={orderItems}
        itemsPrice={itemsPrice}
        shippingPrice={shippingPrice}
        totalPrice={totalPrice}
      />

      {/* Payment & Delivery Status */}
      <PaymentDeliveryStatusCard
        deliveryType={deliveryType}
        paymentMethod={paymentMethod}
        isPaid={isPaid}
        paidAt={paidAt}
        isDelivered={isDelivered}
        deliveredAt={deliveredAt}
      />

      {/* Additional Notes */}
      {additionalNotes && (
        <AdditionalNotesCard additionalNotes={additionalNotes} />
      )}

      {/* Gift & Delivery Date (inline card) */}
<div className="rounded-md border p-4">
  <h3 className="text-base font-semibold mb-2 text-red-500">Extras</h3>

  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <span className={is_gift ? "text-green-600 font-medium" : "text-muted-foreground"}>
        {is_gift ? "🎁 Marked as Gift" : "Not a Gift"}
      </span>
    </div>

    {date ? (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Delivery Date:</span>
        <span className="text-sm font-medium">
          {new Date(date).toLocaleDateString()}
        </span>
      </div>
    ) : (
      <div className="text-sm text-muted-foreground">No scheduled delivery date</div>
    )}
  </div>
</div>
    </div>



  )
}
