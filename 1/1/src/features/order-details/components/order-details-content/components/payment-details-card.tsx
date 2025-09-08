import { formatDistanceToNow } from "date-fns"
import {
  CircleCheckIcon,
  ClockIcon,
  CreditCardIcon,
  XCircleIcon,
} from "lucide-react"

import type { CustomerOrderDetailsData } from "@/types/db"

import { formatDate } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { CopyButton } from "@/components/shared/copy-button"

import { STORE_CLIQ_INFO } from "@/features/order-details/constants"

export const PaymentDetailsCard = ({
  isPaid,
  paidAt,
  paymentMethod,
  deliveryType,
}: Pick<
  CustomerOrderDetailsData,
  "paymentMethod" | "paidAt" | "isPaid" | "deliveryType"
>) => {
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "CLIQ":
        return "CLIQ"
      case "VISA":
        return "Visa Card"
      case "CASH_ON_DELIVERY":
        return "Cash on Delivery"
      default:
        return method
    }
  }

  const getPaymentStatusBadge = () => {
    if (isPaid) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <CircleCheckIcon className="mr-1 size-3" />
          Paid
        </Badge>
      )
    }

    if (paymentMethod === "CASH_ON_DELIVERY") {
      return (
        <Badge variant="secondary">
          <ClockIcon className="mr-1 size-3" />
          Pay on {deliveryType === "DELIVERY" ? "Delivery" : "Pickup"}
        </Badge>
      )
    }

    return (
      <Badge variant="destructive">
        <XCircleIcon className="mr-1 size-3" />
        Pending Payment
      </Badge>
    )
  }

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, "").replace(/^\+/, "")
    return `00${cleaned}`
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCardIcon className="size-5" />
          Payment Details
          <div className="ml-auto">{getPaymentStatusBadge()}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Method */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">
            Payment Method
          </p>
          <p className="font-medium">{getPaymentMethodLabel(paymentMethod)}</p>
        </div>

        {/* CLIQ Payment Instructions */}
        {paymentMethod === "CLIQ" && !isPaid && (
          <>
            <Separator className="bg-border/50" />
            <div className="space-y-4 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <div className="size-2 animate-pulse rounded-full bg-blue-500" />
                <h4 className="font-medium text-blue-900">
                  Complete Your CLIQ Payment
                </h4>
              </div>

              <p className="text-sm text-blue-800 dark:text-blue-200">
                Transfer the exact order amount to our CLIQ account:
              </p>

              {/* CLIQ Account Details */}
              <div className="space-y-3">
                {/* Phone Number */}
                <div className="bg-background flex items-center justify-between rounded-md p-3">
                  <div>
                    <p className="text-muted-foreground text-xs">
                      Phone Number
                    </p>
                    <p className="font-medium">
                      {formatPhoneNumber(STORE_CLIQ_INFO.phoneNumber)}
                    </p>
                  </div>
                  <CopyButton
                    label="Phone Number"
                    text={formatPhoneNumber(STORE_CLIQ_INFO.phoneNumber)}
                  />
                </div>
                {/* Account name */}
                <div className="bg-background rounded-md p-3">
                  <p className="text-muted-foreground text-xs">Account Name</p>
                  <p className="font-medium">{STORE_CLIQ_INFO.accountName}</p>
                </div>
                {/* Bank name */}
                <div className="bg-background rounded-md p-3">
                  <p className="text-muted-foreground text-xs">Bank Name</p>
                  <p className="font-medium">{STORE_CLIQ_INFO.bankName}</p>
                </div>
              </div>

              <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Include order number in the reference</li>
                <li>
                  • Payment confirmation may take up to 15 minutes to process
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Payment Status Details */}
        {isPaid && paidAt && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Payment Date
              </p>
              <div className="flex flex-col">
                <span>{formatDate(paidAt, { hour12: false })}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(paidAt, {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </>
        )}

        {/* Cash on Delivery Info */}
        {paymentMethod === "CASH_ON_DELIVERY" && !isPaid && (
          <>
            <Separator className="bg-border/50" />
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-950/20">
              <div className="mb-2 flex items-center gap-2">
                <ClockIcon className="size-4 text-orange-600" />
                <h4 className="font-medium text-orange-900 dark:text-orange-100">
                  Cash Payment Required
                </h4>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Please have the exact amount ready when you&nbsp;
                {deliveryType === "DELIVERY"
                  ? "receive your delivery"
                  : "pick up your order"}
                . Our payment methods include&nbsp;
                {deliveryType === "DELIVERY" ? (
                  <strong>cash and cliq</strong>
                ) : (
                  <strong>cash, cliq and visa</strong>
                )}
                .
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
