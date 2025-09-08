import { FC } from "react"

import type { WithRequiredOrderNumberParams } from "@/types"

import { getCustomerOrderByOrderNumber } from "@/data"

import { OrderDetailsContent } from "@/features/order-details/components/order-details-content"

export const OrderDetailsPageWrapper: FC<
  WithRequiredOrderNumberParams
> = async ({ params }) => {
  const { orderNumber } = await params

  const order = await getCustomerOrderByOrderNumber(orderNumber)

  return <OrderDetailsContent order={order} />
}
