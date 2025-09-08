import type { Metadata } from "next"
import { Suspense } from "react"

import { getCheckoutCartData, validateCartForCheckout } from "@/data"

import { getCurrentUserInfo } from "@/lib/dal"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { Skeleton } from "@/components/ui/skeleton"

import { EmptyState } from "@/components/shared/empty-state"

import { getPickupInfo } from "@/features/checkout/actions/pick-up.actions"
import { PickupInfoContent } from "@/features/checkout/components/pickup/pickup-info-content"

export const metadata: Metadata = createMetadata(PAGE_METADATA.checkoutPickup)

/**
 * Pickup info page data component
 */
async function PickupInfoPageData() {
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

  const [userInfo, pickupInfo] = await Promise.all([
    getCurrentUserInfo(),
    getPickupInfo(),
  ])

  const defaultValues = {
    name: userInfo?.name || pickupInfo?.name || "",
    email: userInfo?.email || pickupInfo?.email || "",
    phone: userInfo?.phone || pickupInfo?.phone || "",
    additionalNotes: pickupInfo?.additionalNotes || "",
  }

  return (
    <PickupInfoContent
      defaultValues={defaultValues}
      isAuthenticated={!!userInfo}
    />
  )
}

/**
 * Pickup info page skeleton
 */
function PickupInfoPageSkeleton() {
  return <Skeleton className="h-96" />
}

/**
 * Pickup info page component
 */
export default function PickupInfoPage() {
  return (
    <Suspense fallback={<PickupInfoPageSkeleton />}>
      <PickupInfoPageData />
    </Suspense>
  )
}
