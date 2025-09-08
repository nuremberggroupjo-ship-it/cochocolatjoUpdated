/**
 * Place Order Page
 * Final step in checkout process where user reviews and places the order
 */
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { getCheckoutCartData, validateCartForCheckout } from "@/data"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { Skeleton } from "@/components/ui/skeleton"

import { EmptyState } from "@/components/shared/empty-state"

import { getPickupInfo } from "@/features/checkout/actions/pick-up.actions"
import { PickupPlaceOrderContent } from "@/features/checkout/components/pickup/pickup-place-order-content"

/**
 * Place order page metadata
 */
export const metadata: Metadata = createMetadata(PAGE_METADATA.placeOrder)

/**
 * Place order page data component
 */
async function PlaceOrderPageData() {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate loading delay
  // Get cart data for checkout
  const cartSummary = await getCheckoutCartData()

  // Validate cart before proceeding
  const validation = validateCartForCheckout(cartSummary)

  if (!validation.isValid) {
    return (
      <EmptyState
        title="Cannot proceed to checkout"
        description={validation.error || "Your cart is empty"}
        linkText="Continue Shopping"
        linkHref="/shop-now"
      />
    )
  }

  // Get pickup information
  const pickupInfo = await getPickupInfo()

  if (!pickupInfo) {
    // If no pickup info, redirect back to pickup info step
    redirect("/checkout/pickup")
  }

  return <PickupPlaceOrderContent pickupInfo={pickupInfo} />
}

/**
 * Place order page skeleton
 */
function PlaceOrderPageSkeleton() {
  return (
    <main className="w-full space-y-6">
      <Skeleton className="h-80" />
      <div className="flex flex-col justify-start gap-2 sm:flex-row">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </main>
  )
}

/**
 * Place Order Page Component
 */
export default function PlaceOrderPage() {
  return (
    <Suspense fallback={<PlaceOrderPageSkeleton />}>
      <PlaceOrderPageData />
    </Suspense>
  )
}
