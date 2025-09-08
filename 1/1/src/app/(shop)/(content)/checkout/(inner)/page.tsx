import type { Metadata } from "next"
import { Suspense } from "react"

import { getCheckoutCartData, validateCartForCheckout } from "@/data"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { Skeleton } from "@/components/ui/skeleton"

import { EmptyState } from "@/components/shared/empty-state"

import { CheckoutContent } from "@/features/checkout/components/checkout-content"

/**
 * Checkout page metadata
 */
export const metadata: Metadata = createMetadata(PAGE_METADATA.checkout)

/**
 * Checkout page data component
 */
async function CheckoutPageData() {
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
        linkHref="/shop"
      />
    )
  }

  return <CheckoutContent />
}

/**
 * Checkout page loading skeleton
 */
function CheckoutPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
      {/* Action Button Skeleton */}

      <div className="flex flex-col justify-start gap-2 sm:flex-row">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

/**
 * Checkout page component
 */
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutPageSkeleton />}>
      <CheckoutPageData />
    </Suspense>
  )
}
