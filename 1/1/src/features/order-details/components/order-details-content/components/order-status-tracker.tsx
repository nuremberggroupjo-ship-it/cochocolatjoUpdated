import type { FC } from "react"

import {
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  TruckIcon,
} from "lucide-react"

import { DeliveryType, OrderStatus } from "@/lib/_generated/prisma"
import { cn, formatDate } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getStatusTrackingByDeliveryType } from "@/features/order-details/constants"

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus
  deliveryType: DeliveryType
  isPaid: boolean
  isDelivered: boolean
  paidAt?: Date | null
  deliveredAt?: Date | null
}

export const OrderStatusTracker: FC<OrderStatusTrackerProps> = ({
  currentStatus,
  deliveryType,
  deliveredAt,
}) => {
  const statusFlow = getStatusTrackingByDeliveryType(deliveryType)

  const getStepStatus = (stepStatus: OrderStatus) => {
    const statusOrder = [
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
    ]

    const currentIndex = statusOrder.findIndex((s) => s === currentStatus)
    const stepIndex = statusOrder.findIndex((s) => s === stepStatus)

    if (
      currentStatus === OrderStatus.CANCELLED ||
      currentStatus === OrderStatus.REFUNDED
    ) {
      return "cancelled"
      //   return stepIndex === 0 ? "completed" : "cancelled"
    }

    if (stepIndex <= currentIndex) {
      return "completed"
    } else if (stepIndex === currentIndex + 1) {
      return "current"
    } else {
      return "pending"
    }
  }

  const getStepIcon = (stepStatus: OrderStatus, status: string) => {
    if (status === "completed") {
      return <CheckCircleIcon className="size-6 text-green-600" />
    }

    const IconComponent =
      stepStatus === OrderStatus.SHIPPED
        ? TruckIcon
        : stepStatus === OrderStatus.DELIVERED
          ? PackageIcon
          : ClockIcon

    return (
      <IconComponent
        className={cn(
          "size-6",
          status === "current" ? "text-blue-600" : "text-gray-400",
        )}
      />
    )
  }

  const formatStepDate = (stepStatus: OrderStatus) => {
    if (stepStatus === OrderStatus.DELIVERED && deliveredAt) {
      return formatDate(deliveredAt)
    }
    return null
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TruckIcon className="size-5" />
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusFlow.map((step, index) => {
            const stepStatus = getStepStatus(step.status)
            const stepDate = formatStepDate(step.status)
            const isLast = index === statusFlow.length - 1

            return (
              <div key={step.status} className="relative">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="border-border/50 bg-background relative z-10 flex size-12 items-center justify-center rounded-full border-2">
                    {getStepIcon(step.status, stepStatus)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={cn(
                          "font-medium",
                          stepStatus === "completed"
                            ? "text-green-700"
                            : stepStatus === "current"
                              ? "text-blue-700"
                              : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </h4>
                      {stepDate && (
                        <span className="text-muted-foreground text-sm">
                          {stepDate}
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm",
                        stepStatus === "completed"
                          ? "text-green-600"
                          : stepStatus === "current"
                            ? "text-blue-600"
                            : "text-muted-foreground/80",
                      )}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="bg-border/50 absolute top-12 left-6 h-8 w-0.5" />
                )}
              </div>
            )
          })}
        </div>

        {/* Special Status Messages */}
        {currentStatus === OrderStatus.CANCELLED && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
            <p className="text-sm text-red-800 dark:text-red-200">
              This order has been cancelled. If you have any questions, please
              contact our support team.
            </p>
          </div>
        )}

        {currentStatus === OrderStatus.REFUNDED && (
          <div className="mt-4 rounded-lg bg-orange-50 p-4 dark:bg-orange-950/20">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              This order has been refunded. The refund will be processed within
              3-5 business days.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
