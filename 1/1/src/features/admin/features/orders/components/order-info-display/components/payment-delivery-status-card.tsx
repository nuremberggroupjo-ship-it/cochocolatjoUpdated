import { CreditCardIcon } from "lucide-react"

import type { OrderAdminData } from "@/types/db"

import { formatDate } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ORDER_UTILS } from "@/features/admin/features/orders/constants"

export const PaymentDeliveryStatusCard = (
  props: Pick<
    OrderAdminData,
    | "paymentMethod"
    | "isPaid"
    | "paidAt"
    | "isDelivered"
    | "deliveredAt"
    | "deliveryType"
  >,
) => {
  const {
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    deliveryType,
  } = props

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="size-5" />
          Payment & Delivery Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Payment Method
            </p>
            <p className="font-medium">
              {deliveryType === "PICKUP"
                ? "Pay on Arrival"
                : ORDER_UTILS.getPaymentMethodLabel(paymentMethod)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Payment Status
            </p>
            <div className="flex items-center gap-2">
              <Badge variant={isPaid ? "default" : "destructive"}>
                {isPaid ? "Paid" : "Unpaid"}
              </Badge>
              {isPaid && paidAt && (
                <span className="text-muted-foreground text-xs">
                  {formatDate(paidAt as Date)}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              {deliveryType === "DELIVERY"
                ? "Delivery Status"
                : "Pickup Status"}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant={isDelivered ? "default" : "secondary"}>
                {isDelivered ? "Delivered" : "Pending"}
              </Badge>
              {isDelivered && deliveredAt && (
                <span className="text-muted-foreground text-xs">
                  {formatDate(deliveredAt as Date)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
