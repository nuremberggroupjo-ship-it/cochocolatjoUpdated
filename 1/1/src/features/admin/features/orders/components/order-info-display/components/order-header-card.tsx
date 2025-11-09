import {
  CalendarIcon,
  CreditCardIcon,
  PackageIcon,
  ShoppingCartIcon,
} from "lucide-react"

import type { OrderAdminData } from "@/types/db"

import { formatDate } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ORDER_UTILS } from "@/features/admin/features/orders/constants"

export const OrderHeaderCard = (
  props: Pick<
    OrderAdminData,
    | "orderNumber"
    | "createdAt"
    | "updatedAt"
    | "status"
    | "deliveryType"
    | "totalPrice"
  >,
) => {
  const {
    orderNumber,
    createdAt,
    updatedAt,
    status,
    deliveryType,
    totalPrice,
  } = props

  console.log("orderNumber: ",orderNumber);
  

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-y-2 md:flex-row md:items-center">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCartIcon className="size-5" />
              Order number : {orderNumber} 
            </CardTitle>
            <CardDescription>
              Placed on {formatDate(createdAt as Date)}
            </CardDescription>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <Badge
              variant="outline"
              className={ORDER_UTILS.getStatusBadgeVariant(status)}
            >
              {ORDER_UTILS.getStatusLabel(status)}
            </Badge>
            <Badge variant="secondary">
              <span>{ORDER_UTILS.getDeliveryTypeIcon(deliveryType)}</span>
              <span>{ORDER_UTILS.getDeliveryTypeLabel(deliveryType)}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-muted-foreground size-4" />
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-muted-foreground text-xs">
                {formatDate(createdAt as Date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PackageIcon className="text-muted-foreground size-4" />
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-muted-foreground text-xs">
                {formatDate(updatedAt as Date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditCardIcon className="text-muted-foreground size-4" />
            <div>
              <p className="text-sm font-medium">Total</p>
              <p className="text-sm font-semibold">
                {ORDER_UTILS.formatPrice(Number(totalPrice))}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
