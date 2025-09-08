import { type Metadata } from "next"
import { Suspense } from "react"

import type { WithRequiredIdParams } from "@/types"

import { getOrderByIdAdmin } from "@/data"

import { OrderPageWrapper } from "@/features/admin/features/orders/components/order-page-wrapper"
import { OrderPageWrapperSkeleton } from "@/features/admin/features/orders/components/order-page-wrapper-skeleton"

export default async function OrderPage({ params }: WithRequiredIdParams) {
  return (
    <Suspense fallback={<OrderPageWrapperSkeleton />}>
      <OrderPageWrapper params={params} />
    </Suspense>
  )
}

export async function generateMetadata({
  params,
}: WithRequiredIdParams): Promise<Metadata> {
  const { id } = await params

  const order = await getOrderByIdAdmin(id)

  if (!order) {
    return {
      title: "Order Not Found",
    }
  }

  return {
    title: `Order #${order.orderNumber}`,
    description: `View and edit details for order #${order.orderNumber}`,
  }
}
