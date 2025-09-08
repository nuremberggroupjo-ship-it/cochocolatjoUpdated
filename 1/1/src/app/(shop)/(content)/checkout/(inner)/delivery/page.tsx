import type { Metadata } from "next"
import { Suspense } from "react"

import { getCheckoutCartData, validateCartForCheckout } from "@/data"

import { verifySession } from "@/lib/dal"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { EmptyState } from "@/components/shared/empty-state"

import { getDeliveryInfo } from "@/features/checkout/actions/delivery.actions"
import { DeliveryInfoContent } from "@/features/checkout/components/delivery/delivery-info-content"
import { AddressSchema } from "@/features/checkout/schemas/address.schema"

/**
 * Delivery info page metadata
 */
export const metadata: Metadata = createMetadata(PAGE_METADATA.checkoutDelivery)

/**
 * Delivery info page data component
 */
async function DeliveryInfoPageData() {
  // Require authentication for delivery page
  const { user } = await verifySession()

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

  // Check if delivery info exists in cookies
  const deliveryInfo = await getDeliveryInfo()

  const defaultAddressId =
    user.addresses.length > 0
      ? (user.addresses as AddressSchema[]).find((addr) => addr?.isDefault)?.id
      : null

  // Use saved delivery info from cookie if available, otherwise use user info
  const defaultValues = {
    name: deliveryInfo?.name || user.name,
    email: deliveryInfo?.email || user.email,
    phone: deliveryInfo?.phone || user.phone || "",
    selectedAddressId:
      deliveryInfo?.selectedAddressId || defaultAddressId || "",
    additionalNotes: deliveryInfo?.additionalNotes || "",
  }

  return (
    <DeliveryInfoContent
      defaultValues={defaultValues}
      addresses={user.addresses as AddressSchema[]}
      defaultAddressId={defaultAddressId}
    />
  )
}

/**
 * Delivery info page skeleton
 */
function DeliveryInfoPageSkeleton() {
  return <div className="bg-muted h-96 animate-pulse rounded-lg" />
}

/**
 * Delivery Info Page Component
 *
 * Page for collecting delivery information
 * Supports both authenticated and guest users
 * Pre-fills form data for authenticated users
 */
export default function DeliveryInfoPage() {
  return (
    <Suspense fallback={<DeliveryInfoPageSkeleton />}>
      <DeliveryInfoPageData />
    </Suspense>
  )
}
