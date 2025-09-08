import { type Metadata } from "next"
import { Suspense } from "react"

import type { WithRequiredOrderNumberParams } from "@/types"

import { getCustomerOrderByOrderNumber } from "@/data"

import { OrderDetailsPageWrapper } from "@/features/order-details/components/order-details-page-wrapper"
import { OrderDetailsSkeleton } from "@/features/order-details/components/order-details-skeleton"

export default async function OrderDetailsPage({
  params,
}: WithRequiredOrderNumberParams) {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetailsPageWrapper params={params} />
    </Suspense>
  )
}

/**
 * Generate metadata for the order details page
 */
export async function generateMetadata({
  params,
}: WithRequiredOrderNumberParams): Promise<Metadata> {
  try {
    const { orderNumber } = await params

    // Try to get order for metadata (with error handling)
    const order = await getCustomerOrderByOrderNumber(orderNumber)

    const { generateDynamicMetadata, createMetadata } = await import(
      "@/constants"
    )
    return createMetadata(
      generateDynamicMetadata.orderDetails(order.orderNumber),
    )
  } catch {
    // Fallback metadata if order not found or error occurred
    return {
      title: "Order Details",
      description: "View your order information and status",
    }
  }
}
