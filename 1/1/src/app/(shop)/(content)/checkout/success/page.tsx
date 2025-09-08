import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { getCustomerOrderByOrderNumber } from "@/data"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { Skeleton } from "@/components/ui/skeleton"

import { OrderSuccessCartCleanup } from "@/features/checkout/components/order-success-cart-cleanup"
import { OrderSuccessContent } from "@/features/checkout/components/order-success-content"

export const metadata: Metadata = createMetadata(PAGE_METADATA.checkoutSuccess)

interface OrderSuccessPageProps {
  searchParams: Promise<{
    orderNumber?: string
  }>
}

/**
 * Order success page data component
 */
async function OrderSuccessPageData({ searchParams }: OrderSuccessPageProps) {
  const { orderNumber } = await searchParams

  if (!orderNumber) {
    redirect("/order-history")
  }
  const order = await getCustomerOrderByOrderNumber(orderNumber)

  return (
    <>
      <OrderSuccessContent order={order} />
      <OrderSuccessCartCleanup />
    </>
  )
}

/**
 * Order success page skeleton
 */
function OrderSuccessPageSkeleton() {
  return (
    <div className="my-4 space-y-6">
      {/* Success Header Skeleton */}
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto size-16 rounded-full" />
        <Skeleton className="mx-auto h-8 max-w-sm" />
        <Skeleton className="mx-auto h-4 max-w-md" />
      </div>

      {/* Order Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 max-w-xs" />
        <Skeleton className="h-4 max-w-sm" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="columns-1 gap-4 space-y-4 lg:columns-2">
        {/* Card Skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="break-inside-avoid">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-center gap-4 pt-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

/**
 * Order Success Page Component
 *
 * Displays order confirmation details
 * Shows order number and next steps
 */
export default function OrderSuccessPage(props: OrderSuccessPageProps) {
  return (
    <Suspense fallback={<OrderSuccessPageSkeleton />}>
      <OrderSuccessPageData {...props} />
    </Suspense>
  )
}
