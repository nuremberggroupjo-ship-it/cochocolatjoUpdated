/**
 * Delivery Place Order Page
 * Final step in delivery checkout process where user reviews and places the order
 */
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { getCheckoutCartData, validateCartForCheckout } from "@/data"

import { verifySession } from "@/lib/dal"

import { Skeleton } from "@/components/ui/skeleton"

import { EmptyState } from "@/components/shared/empty-state"

import { getDeliveryInfo } from "@/features/checkout/actions/delivery.actions"
import { DeliveryPlaceOrderContent } from "@/features/checkout/components/delivery/delivery-place-order-content"
import { AddressSchema } from "@/features/checkout/schemas/address.schema"

/**
 * Place order page metadata
 */
export const metadata: Metadata = {
  title: "Place Order - Checkout",
  description: "Review your delivery order and complete the purchase.",
}

/**
 * Place order page data component
 */
async function PlaceOrderPageData() {
  // Require authentication for place order page
  const { user } = await verifySession()

  // Check if user has VISA payment method selected (not allowed)
  if (user.paymentMethod === "VISA") {
    redirect("/checkout/delivery/payment-method")
  }

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

  // Get delivery information
  const deliveryInfo = await getDeliveryInfo()

  if (!deliveryInfo) {
    // If no delivery info, redirect back to delivery info step
    redirect("/checkout/delivery")
  }

  const selectedAddress = (user.addresses as AddressSchema[]).find(
    (address) => address.id === deliveryInfo.selectedAddressId,
  )

  if (!selectedAddress) {
    redirect("/checkout/delivery")
  }

  return (
    <DeliveryPlaceOrderContent
      deliveryInfo={deliveryInfo}
      selectedAddress={selectedAddress}
      paymentMethod={user.paymentMethod}
    />
  )
}

/**
 * Place order page skeleton
 */
function PlaceOrderPageSkeleton() {
  return <Skeleton className="h-96" />
}

/**
 * Delivery Place Order Page Component
 *
 * Final step in delivery checkout process
 * Shows order summary and allows user to place the order
 */
export default function DeliveryPlaceOrderPage() {
  return (
    <Suspense fallback={<PlaceOrderPageSkeleton />}>
      <PlaceOrderPageData />
    </Suspense>
  )
}
