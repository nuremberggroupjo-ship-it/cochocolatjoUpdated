import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { getCheckoutCartData, validateCartForCheckout } from "@/data"

import { verifySession } from "@/lib/dal"

import { PAGE_METADATA, createMetadata } from "@/constants"

import { Skeleton } from "@/components/ui/skeleton"

import { EmptyState } from "@/components/shared/empty-state"

import { getDeliveryInfo } from "@/features/checkout/actions/delivery.actions"
import { PaymentMethodContent } from "@/features/checkout/components/payment-method/payment-method-content"

/**
 * Payment method page metadata
 */
export const metadata: Metadata = createMetadata(PAGE_METADATA.paymentMethod)

/**
 * Payment method page data component
 */
async function PaymentMethodPageData() {
  // Require authentication for payment method page
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

  // Get delivery information
  const deliveryInfo = await getDeliveryInfo()

  if (!deliveryInfo) {
    // If no delivery info, redirect back to delivery page
    redirect("/checkout/delivery")
  }

  return (
    <PaymentMethodContent
      defaultPaymentMethod={
        user.paymentMethod === "VISA"
          ? "CASH_ON_DELIVERY" // Fallback to COD if user has VISA selected
          : user.paymentMethod
      }
    />
  )
}

/**
 * Payment method page skeleton
 */
function PaymentMethodPageSkeleton() {
  return <Skeleton className="h-96" />
}

/**
 * Payment Method Page Component
 *
 * Page for selecting payment method after delivery information
 * Requires delivery info to be saved in cookies
 */
export default function PaymentMethodPage() {
  return (
    <Suspense fallback={<PaymentMethodPageSkeleton />}>
      <PaymentMethodPageData />
    </Suspense>
  )
}
